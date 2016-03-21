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

//   send projects, if not admin filters based on isGroupLeader permission
exports.listProjects = function(req, res){
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
        Project.find().exec(function(err, projects){  // send all projects
          if(err){
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          }
          console.log("All projects have been found successfully");
          res.send(projects);
        });
      }
      else{
  	    var projectNames = Object.keys(user.clientSitePermissions);  // send projects based on permissions
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
            console.log('A project failed to be sent');
          } else {
            console.log('All projects have been found successfully');
            res.send(response);
          }
        });
      }
	  }
  });
};

//    send projects based on projectAccess permission
exports.projectAccess = function(req, res){
  if(req.user){
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
  }
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
