'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function (req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function (req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function (req, res) {
  var user = req.model;

  user.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
  User.findById(req.user._id).exec(function(err, user){  // find current user
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    if(user){
      var isAdmin = false;
      for(var i = 0; i < user.roles.length; i++){  // check for admin role
        if(user.roles[i] === 'admin'){
          isAdmin = true;
        }
      }
      if(isAdmin === true){
        User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
          if (err) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          res.json(users);
        });
      }
      else{
        var memberIDs = user.groupMembers;
        var response = [];
        async.each(memberIDs, function(file, callback) {
          User.find({ _id: file }).exec(function(err, member){
            if(err){
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
            if(member[0]){
              response.push(member[0]);
            }
            callback();
          });   
        }, function(err){
          if( err ) {
            console.log('A member failed to be sent');
          } else {
            console.log('All members have been found successfully');
            res.send(response);
          }
        });
      }
    }
  });


/*  User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function (err, users) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    res.json(users);
  });*/
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id, '-salt -password').exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load user ' + id));
    }

    req.model = user;
    next();
  });
};
