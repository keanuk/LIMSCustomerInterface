'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  async = require('async'),
  passport = require('passport'),
  chalk = require('chalk'),
  _ = require('lodash'),
  url = require('url'),
  utf8 = require('utf8'),
  mailer = require('../../../../core/server/controllers/mail.server.controller.js'),
  User = mongoose.model('User');

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];

// Generate a random password
var generateTempURLKey = function() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for( var i = 0; i < 120; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

exports.validateTempUser = function(req, res, next) {
  var userId = req.query.userId;
  User.findById(userId, function(err, user) {
    if (err) {
      res.sendStatus(500).end('Could not find temp user to validate');
      return;
    } else if (user.tempPassword === '') {
      res.sendStatus(403).end('Not an un-verified user');
      return;
    } else {
      next();
    }
  });
};

exports.getTempUserInfo = function(req, res) {
  User.findById(req.query.userId, function(err, user) {
    if (err) {
      res.sendStatus(500).end('Could not find temp user to validate');
      return;
    } else {
      var now = Date.now();
      if(now - Date.parse(user.resetPasswordExpires) > 0){
        res.sendStatus(403).end('Reset password link has expired');
      }
      else{
        var tempUserCredentials = {
          username: user.username,
          tempPassword: user.tempPassword
        };
        res.setHeader('Content-Type', 'application/json');
        res.json(tempUserCredentials);
      }
    }
  });
};

//Admin signs up a group-leader with this function
exports.adminSignup = function(req, res) {
  // For security measurement we remove the roles from the req.body object because people might try to add their own roles
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  var testing = 0;
  async.waterfall([ // runs sequentially so that proper role is added
    function(callback){
      User.findById(req.user._id).exec(function(err, requestingUser){ // finds current user in DB
        if(err){
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        if(requestingUser){
          user.clientSitePermissions = {};
          var isAdmin = false;
          if(_.includes(requestingUser.roles, 'admin')){ // if admin, add a group leader
            var role = [];
            role.push('groupleader');
            user.roles = role;

            for (var i in req.body.projectCodePermissions) {
              var projectCode = req.body.projectCodePermissions[i];
              user.clientSitePermissions[projectCode] = {
                isGroupLeader: true,
                messageBoardAccess: true,
                projectFinancesAccess: true,
                projectAccess: true,
                platesAccess: true,
                samplesAccess: true
              };
            }
            isAdmin = true;

            callback();
          }
          if(_.includes(requestingUser.roles, 'groupleader')){ // if groupleader, add permission for a member
            var memberPermissions = [];
            for(var i1 = 0; requestingUser.groupMembers && i1 < requestingUser.groupMembers.length; i1++){
              memberPermissions.push(requestingUser.groupMembers[i1]);
            }
            memberPermissions.push('' + user._id);
            requestingUser.groupMembers = memberPermissions;
            requestingUser.save(function (err){
              if(err){
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              }
              else{
                console.log('Permission added to database');
              }
            });

            if(isAdmin === false){
              for (var i2 in req.body.projectCodePermissions) {
                var projectCode1 = req.body.projectCodePermissions[i2];
                user.clientSitePermissions[projectCode1] = {
                  isGroupLeader: false,
                  messageBoardAccess: true,
                  projectFinancesAccess: true,
                  projectAccess: true,
                  platesAccess: true,
                  samplesAccess: true
                };
              }
            }

            callback();
          }
        }
      });
    },
    function(callback){

/*      user.clientSitePermissions = {};

      for (var i in req.body.projectCodePermissions) {
        var projectCode = req.body.projectCodePermissions[i];
        user.clientSitePermissions[projectCode] = {
          isGroupLeader: true,
          messageBoardAccess: true,
          projectFinancesAccess: true,
          projectAccess: true,
          platesAccess: true,
          samplesAccess: true
        };
      }*/

      /* Add missing user fields */
      user.provider = 'local';
      user.displayName = user.firstName;
      user.password = '' + generateTempURLKey();
      user.tempPassword = user.password;
      user.groupMembers = [];

      user.username = 'un-verified:' + user._id;

      user.save(function (err) {
        if (err) {
			    console.log(err);
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          var newAccountURL = 'http://localhost:3000/signin?userId=' + user._id;
          var mailOptions = {
            emailURL: newAccountURL,
            invitingUser: 'the Dev Team',
            mailTo: user.firstName + ' ' + user.lastName + '<' + user.email + '>'
          };
          mailer.sendMail(mailOptions, function(err) {
            if (err) {
              return res.sendStatus(500).end('Couldn\'t send email.');
            }
            res.end('We all good homie');
          });
        }
      });
//      callback();
    }
  ], function(err){
    if(err){
      console.log(err);
    }
  });
};

/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init Variables
  var user = new User(req.body);
  var message = null;

  // Add missing user fields
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication. For clarification, see http://toon.io/understanding-passportjs-authentication-flow/
 */
exports.signin = function (req, res, next) {
  /* passport.authenticate uses the req.user.username and req.user.password fields to
     validate the user here, so they must be names as such on the request body. They're
     still in plain text at this point. */
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      /* This information comes from our database document of the user. We don't
         want to return our salt (key to de-hash password?) or password (hashed?) to the client */

      // verify user creation date to see if it's expired
      var now = Date.now();
      var created = Date.parse(user.created);
      now = now / 86400000; // days
      created = created / 86400000; // days
      if((user.username === ("un-verified:" + user._id)) && ((now - created > 15))){ // 15 day limit
          User.findByIdAndRemove(user._id, function (err){ // remove expired user from database to avoid future conflicts
            if(err){
              console.log(err);
            }
          });
          var outdated = { message: 'Your link has expired. Please contact rapidgenommailer@gmail.com or the person who added you.' };
          res.status(400).send(outdated); // let the client know that their link has expired
      }
      else{
        console.log(user.password);
        user.password = undefined;
        user.salt = undefined;

        // Establish an authenticated login session between the user and server
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            res.json(user);
          }
        });
      }
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call used for things like signing in via a facebook account
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
