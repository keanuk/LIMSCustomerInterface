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

mongoose.connect(mongolabsURI);
mongoose.connection.on('open', function(){
    console.log('Connected.');
    async.waterfall([
      function(callback) {
        Project.findOne({'projectCode': 'Project20'}, function(err, project) {
          if (err) { console.error(err); return callback(null); }
          console.log(JSON.stringify(project));
          callback();
        });
      }
    ], function(err, finalInfo) {
        console.log('Closing conection.');
        mongoose.connection.close();
    });

});
