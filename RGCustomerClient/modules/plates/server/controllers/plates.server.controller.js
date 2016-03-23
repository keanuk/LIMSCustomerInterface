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
	var undefinedRequest = req && req.user && req.user._id;
	if (!undefinedRequest) {
		res.status(403).send('req.user or req.user._id undefined');
		return;
	}

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
