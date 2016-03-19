'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sample Schema
 */
var SampleSchema = new Schema({

    //Read from plate layout
    plateLayoutRowSort: {
        type: Number,
        //required: 'Row sort must be specified'
    },
    plateLayoutColumnSort: {
        type: Number,
        //required: 'Column sort must be specified'
    },
    sampleCode: { //lab sample code
        type: String,
        //required: 'Sample code must be specified'
    },
    uniqueClientCode: {
        type: String,
        default: ''
    },
    customerConcentration: { //customer concentration
        type: Number,
        //required: 'Sample concentration must be specified'
    },
    volume: { //customer volume
        type: Number,
        //required: 'Sample volume must be specified'
    },
    comment: {
        type: String,
        default: ''
    },
    totalDNA: { //lab total DNA
        type: Number,
        default: 0.00
    },



    //------------------------

    //Read from quantification files
    replicateOneRFU: { /* gDNA */
        type: Number,
        default: 0
    },
    replicateTwoRFU: { /* gDNA */
        type: Number,
        default: 0
    },

    /* This should be the average of the two RFU's concentration if there is more than one replicate */
    initialGDNAConcentration: {  /* gDNA */
        type: Number,
        default: 0
    },
    gDNAQuantificationInfo: [{
        replicateOneRFU: Number,
        replicateTwoRFU: Number,
        concentration: Number,
        timestamp: Date
    }],
    libraryDNAreplicateOneRFU: { /* library Quant */
        type: Number,
        default: 0
    },
    libraryDNAreplicateTwoRFU: { /* library Quant */
        type: Number,
        default: 0
    },
    libraryDNAConcentration: { /* library Quant */
        type: Number,
        default: 0
    },
    libraryDNAQuantificationInfo: [{
        replicateOneRFU: Number,
        replicateTwoRFU: Number,
        concentration: Number,
        timestamp: Date
    }],
    //-------------------------------

    // Normalization Data
    normalizations: [{
        volumeUsed: Number,
        timestamp: Date,
        thresholdNormalizedTo: Number
    }]
    //-------------------------------

});

mongoose.model('Sample', SampleSchema);
