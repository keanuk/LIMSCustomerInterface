'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Project = mongoose.model('Project'),
  async = require('async'),
	_ = require('lodash'),
  errorHandler = require( path.resolve('./modules/core/server/controllers/errors.server.controller') );

//   send projects, if not admin filters based on isGroupLeader permission
exports.listProjects = function(req, res){
  if (!(req && req.user && req.user._id)){
	res.status(200).send('Not logged in.');
	return;
  }
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
	var undefinedRequest = req && req.user && req.user._id;
	if (!undefinedRequest) {
		res.status(200).send('req.user or req.user._id undefined');
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
		     	if (user.clientSitePermissions[file].platesAccess === true){
			      Project.find({ projectCode: file }).populate('plates').exec(function(err, project){
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
				  } else {
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
				  }
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
  
  User.findById(req.query.userId).exec(function(err, user){
    if(err) {
      //console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    if(user) {
		  if (user.clientSitePermissions) {
			  var projectNames = Object.keys(user.clientSitePermissions);
			  console.log('All projects have been sent successfully');
			  res.send(projectNames);
			  console.log(projectNames);
		  }
    }
    else{
      return res.status(404).send({});
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
