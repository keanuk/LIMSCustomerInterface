'use strict';

require('./plate-schema.js');
require('./project-schema.js');
require('./sample-schema.js');

var mongoose = require('mongoose');
var async = require('async');
var Sample = mongoose.model('Sample');
var Plate = mongoose.model('Plate');
var Project = mongoose.model('Project');
var mongolabsURI= require('../RGCustomerClient/config/env/local.js').db.uri;

var createDummyProject = function(projectCode, callback) {
    var newProject = {
        "lastEditor" : ("54b598906fac250a6ba470d7"),
        "user" : ("54d11aeeef27b57820ddffec"),
        "customer" : ("550b2e54e94268002368b81b"),
        "organism" : ("5588149422f8439c533770f4"),
        "analysisStageComment" : "",
        "analysisStage" : "N/A",
        "bedFileComment" : "",
        "bedFile" : "N/A",
        "referenceGenomeFileComment" : "",
        "referenceGenomeFile" : "N/A",
        "probeFileComment" : "",
        "probeFile" : "N/A",
        "contractComment" : "",
        "contract" : "N/A",
        "totalReagentsAndLibraryComment" : "",
        "totalReagentsAndLibrary" : "$123.00",
        "totalProbesComment" : "",
        "totalProbes" : "$123.00",
        "totalSequencingComment" : "",
        "totalSequencing" : "$123",
        "invoicesComment" : "",
        "invoices" : "N/A",
        "totalContractComment" : "",
        "totalContract" : "$123.00",
        "priceComment" : "",
        "price" : "$123.00",
        "arrivalImageNames" : [],
        "arrivalImages" : [],
        "gelImageNames" : [
            "AMN_666901_QC_Gel_gDNA.JPG"
        ],
        "gelImages" : [
            "569e564b72b72fd07af79360"
        ],
        "machineTypeComment" : "",
        "machineType" : "HiSeq3000 V1",
        "indexingModeComment" : "",
        "indexingMode" : "Dual",
        "enzymeComment" : "",
        "enzyme" : "Kapa",
        "sequencingTypeComment" : "",
        "sequencingType" : "PairedEnd",
        "daysSinceSamplesOrderedComment" : "",
        "samplesOrderedDateComment" : "",
        "samplesOrderedDate" : null,
        "samplesArrivalDateComment" : "",
        "samplesArrivalDate" : new Date(),
        "arrivedSamplesComment" : "",
        "totalSamplesExpectedComment" : "",
        "totalSamplesExpected" : "192",
        "probesOrderedDateComment" : "",
        "probesOrderedDate" : null,
        "numberOfProbesComment" : "",
        "probeProviderComment" : "",
        "probeComment" : "",
        "probe" : "UCE-5Kv1",
        "lastLaneUsageComment" : "",
        "lastLaneUsage" : 1,
        "sequencingPlexComment" : "",
        "sequencingPlex" : "192",
        "capturePlexComment" : "",
        "capturePlex" : "24",
        "logs" : [
            ("569d638990100487752e1070")
        ],
        "userComment" : "",
        "projectStatusComment" : "",
        "projectStatus" : false,
        "description" : "",
        "platesComment" : "",
        "plates" : [
            ("569e526290100487752e107f"),
            ("569e526290100487752e1080")
        ],
        "sequencingMethodComment" : "",
        "sequencingMethod" : "Capture-Seq",
        "organismComment" : "",
        "customerComment" : "",
        "projectCodeComment" : "",
        "projectCode" : projectCode,
        "lastEditedComment" : "",
        "lastEdited" : new Date(),
        "daysSinceCreationComment" : "",
        "daysUntilDueComment" : "",
        "dueComment" : "",
        "due" : new Date(),
        "mismatchPercentageComment" : "",
        "mismatchPercentage" : "",
        "projectCreatedDateComment" : "",
        "created" : new Date(),
        "__v" : 4,
        "daysUntilProbeArrivalComment" : "",
        "isUrgent" : false,
        "shearingMethod" : "Seq2",
        "shearingMethodComment" : ""
    };
    var newProjectModel = Project(newProject);
    newProjectModel.save(function(err) {
      if (err) {
        console.error(err);
        return callback(null);
      } else {
        console.log('Successfully saved ' + newProjectModel.projectCode);
        return callback(null);
      }
    });
};

mongoose.connect(mongolabsURI);
mongoose.connection.on('open', function(){
    console.log('Connected.');
    async.waterfall([
      /* Create all projects function */
      function(callback) {
        var numberArray = [];

        for (var i = 0; i < 100; ++i) {
            numberArray.push(i);
        }

        async.each(numberArray, function(number, callback) {
          createDummyProject('Project' + number, function() {
            return callback(null);
          });
        }, function(err) {
          if (err) { console.error(err); }
          callback();
        });
      }//,
      /* Remove all projects function */
      // function(callback) {
      //   Project.find({}, function(err, projects) {
      //     async.each(projects, function(project, callback) {
      //         project.remove(function(err) {
      //           if (err) { console.error(err); }
      //           else { console.log('Successfully removed ' + project.projectCode); }
      //           callback(null);
      //         });
      //     }, function(err) {
      //         callback(null);
      //     });
      //   });
      // }
    ], function(err, finalInfo) {
        console.log('Closing conection.');
        mongoose.connection.close();
    });

});
