'use strict';

require('./plate-schema.js');
require('./project-schema.js');
require('./sample-schema.js');

const mongoose = require('mongoose');
const asyncLib = require('async');
const Sample = mongoose.model('Sample');
const Plate = mongoose.model('Plate');
const Project = mongoose.model('Project');
const mongolabsURI= require('../RGCustomerClient/config/env/local.js').db.uri;
const projectConstructor = require('./constructors/projectConstructor.js');
const plateConstructor = require('./constructors/plateConstructor.js');


//Per project, create nine plates with random stages
var createDummyPlates = function(projectCode, projectId, callback) {
	console.log('createDummyPlates(' + projectCode + ',' + projectId + ')');

	var numbers = ['1','2','3','4','5','6','7','8','9'];
	var plateIds = [];
	asyncLib.each(numbers, function(number, callback) {
		var plateCode = projectCode + '_P0' + number;
		var newPlateModel = plateConstructor.getNewPlateTemplate(plateCode, projectId);
		var newPlate = new Plate(newPlateModel);
		newPlate.save(function(err, savedPlate) {
			console.log('newPlate:' + JSON.stringify(newPlate));
			if (err) console.log(err);
			else {
				plateIds.push( String(savedPlate._id) );
				console.log('Saved plate: ' + number + ' for project ' + projectCode);
				callback(null);
			}
		});
	}, function(err) {
		if (err) console.log(err);
		else callback(plateIds);
	});

};

//Create a new project, save it, and then add plates to it and re-save the project
var createDummyProject = function(projectCode, callback) {
	console.log('createDummyProject(' + projectCode + ')');

  var newProjectModel = projectConstructor.getNewProjectTemplate(projectCode);
  var newProject = new Project(newProjectModel);
  newProject.save(function(err, savedProject) {
    if (err) {
      console.error(err);
      return callback(null);
    } else {
			createDummyPlates(projectCode, savedProject._id, function(plateIds) {
				var projectPlates = [];
				for (var i = 0; i < plateIds.length; i++) {
					projectPlates.push( new mongoose.mongo.ObjectID(plateIds[i]) );
				}
				savedProject.plates = projectPlates;
				savedProject.save(function(err, finalProject) {
					if (err) console.log(err);
					else {
						console.log('Saved ' + finalProject.projectCode);
						callback(null);
					}
				});
			});
    }
  });

};

var removeAllProjects = function(callback) {
	Project.find({}, function(err, projects) {
    asyncLib.each(projects, function(project, callback) {
        project.remove(function(err) {
          if (err) { console.error(err); }
          else { console.log('Successfully removed ' + project.projectCode); }
          callback(null);
        });
    }, function(err) {
        callback(null);
    });
  });
};

mongoose.connect(mongolabsURI);
mongoose.connection.on('open', function(){
    console.log('Connected.');
    asyncLib.waterfall([
      /* Create all projects function */
      function(callback) {
        var numberArray = [];

        for (var i = 0; i < 100; ++i) {
						if (i < 10) i = ('0' + i);
            numberArray.push(i);
        }

        asyncLib.each(numberArray, function(number, callback) {
          createDummyProject('ABC_1234' + number, function() {
            return callback(null);
          });
        }, function(err) {
          if (err) { console.error(err); }
          else {
						console.log('Finished processing plates');
						callback();//Gets called after all projects save, which moves us to the next function in the waterfall array
					}
        });
      }//,
      // function(callback) {
      //  	removeAllProjects(function() {
			// 		callback();
			// 	});
      // }
    ], function(err, finalInfo) {
        console.log('Closing conection.');
        mongoose.connection.close();
    });

});
