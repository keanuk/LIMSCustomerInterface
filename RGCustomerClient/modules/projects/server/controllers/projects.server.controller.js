// 'use strict';

// /**
//  * Module dependencies.
//  */
// var _ = require('lodash');

// /**
//  * Extend user's controller
//  */
// module.exports = _.extend(
//   require('./users/users.authentication.server.controller'),
//   require('./users/users.authorization.server.controller'),
//   require('./users/users.password.server.controller'),
//   require('./users/users.profile.server.controller')
// );

'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  async = require('async'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.listProjects = function(req, res){
  var isAdmin = false;
  for(var i = 0; i < req.user.roles.length; i++){
    if(req.user.roles[i] === 'admin'){
      isAdmin = true;
    }
  }
  if(isAdmin === true){
    Project.find().exec(function(err, projects){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      res.send(projects);
    });
  }
  else{
  User.findById(req.user._id).exec(function(err, user){
  	if(err){
  	  return res.status(400).send({
  	  	message: errorHandler.getErrorMessage(err)
  	  });
  	}
  	if(user){

  	  var projectNames = Object.keys(user.clientSitePermissions);
  	  var response = [];
	  async.each(projectNames, function(file, callback) {
	    Project.find({ projectCode: file }).exec(function(err, project){
    	  if(err){
      	    return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
      	    });
    	  }
    	  if(user.clientSitePermissions[file].isGroupLeader === true){
    	    response.push(project[0]);
    	  }
    	  callback();
  	    });	  
	  }, function(err){
        if( err ) {
          console.log('A project failed to display');
        } else {
          console.log('All projects have been sent successfully');
          res.send(response);
        }
	  });
	}
  });
  }
};

exports.projectAccess = function(req, res){
  User.findById(req.user._id).exec(function(err, user){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    if(user){

      var projectNames = Object.keys(user.clientSitePermissions);
      var response = [];
    async.each(projectNames, function(file, callback) {
      Project.find({ projectCode: file }).exec(function(err, project){
        if(err){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
        }
        if(user.clientSitePermissions[file].projectAccess === true){
          response.push(project[0]);
        }
        callback();
        });   
    }, function(err){
        if( err ) {
          console.log('A project failed to display');
        } else {
          console.log('All projects have been sent successfully');
          res.send(response);
        }
    });
  }
  });
};

exports.otherUserProjects = function (req, res) {
  console.log(req.query.userId);
  User.findById(req.query.userId).exec(function(err, user){
    if(err) {
      //console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    if(user) {
      var projectNames = Object.keys(user.clientSitePermissions);
      console.log('All projects have been sent successfully');
      res.send(projectNames);
      console.log(projectNames);
    }
  });

};

exports.updatePermissions = function (req, res) {
  //console.log(req.body);
  //console.log(req.body.params.user);
  var userNew = req.body.params.user;
  //console.log(userNew);
  User.findById(req.user._id).exec(function(err, currentUser) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    if(currentUser) {
      User.findById(userNew._id).exec(function(err, userOld) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
        if(userOld) {
          var Keys = Object.keys(userNew.clientSitePermissions);
          for (var j = 0; j < Keys.length; j++) {
            if (userNew.clientSitePermissions[Keys[j]] === undefined) {
              return res.status(403).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          }
          /*for (var i = 0; i < currentUser.clientSitePermissions.length; i++) {
            for (var j = 0; j < userNew.clientSitePermissions.length; j++) {
              if (currentUser.clientSitePermissions[i] != userNew.clientSitePermissions[j]) {

              }
            }
          }*/
          userOld.clientSitePermissions = userNew.clientSitePermissions;
          //console.log(userNew.clientSitePermissions);
          userOld.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          });
        }
      });
    }
  });
};

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
