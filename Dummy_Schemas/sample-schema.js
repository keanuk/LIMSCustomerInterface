'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash'),
	moment = require('moment');

// Include our virtual fields
var schemaOptions = {
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
};

/**
 * Sample Schema
 */
var SampleSchema = new Schema({

    //Read from plate layout
    plateLayoutRowSort: {
        type: Number,
				min: 1
    },
    plateLayoutColumnSort: {
        type: Number,
				min: 1
    },
	sampleCode: { // lab sample code (i.e.): ABC_123456_P01_WA01
      type: String,
			required: 'Sample must have sample code',
			maxlength: 19,
			minlength: 19,
			match: /[A-Z]{3}_[0-9]{6}_P[0-9]{2}_W[A-H][0-9]{2}/
  },
  uniqueClientCode: {
      type: String,
      default: ''
  },
  customerConcentration: { // customer concentration
      type: Number,
			default: 0
  },
  volume: { // customer volume
      type: Number,
			default: 0
  },
  comment: {
      type: String,
      default: ''
  },

	// Should be renamed to concentration info, as it can contain Drying information as well.
  gDNAQuantificationInfo: [{
    resultType: {
	    type: String,
	    default: 'GDNAQuantification',
			required: true,
			enum: ['GDNAQuantification', 'Drying']
		},
    replicateOneRFU: Number,
    replicateTwoRFU: Number,
		concentration: {
			type: Number,
			required: true
		},
		timestamp: {
			type: Date,
			required: true
		}
  }],

  libraryDNAQuantificationInfo: [{
    replicateOneRFU: Number,
    replicateTwoRFU: Number,
		concentration: {
			type: Number,
			required: true
		},
		timestamp: {
			type: Date,
			required: true
		}
  }],

  normalizations: [{
		volumeUsed: {
			type: Number,
			required: true
		},
		dnaUsed: {
			type: Number,
			required: true,
			default: 0
		},
		timestamp: {
			type: Date,
			required: true
		},
		thresholdNormalizedTo: {
			type: Number,
			required: true
		}
  }],

	pcrEnrichmentInfo: [{
		cycles: {
			type: Number,
			min: 4,
			max: 20,
			required: '# Cycles is Required for PCR!'
		},
		timestamp: {
			type: Date,
			required: true
		}
	}]

}, schemaOptions);

SampleSchema.virtual('totalLibraryDNA').get(function() {
	return this.currentLibraryDNAConcentration * 30.0;
});

SampleSchema.virtual('currentLibraryDNAConcentration').get(function() {
	try {
		return _.last(this.libraryDNAQuantificationInfo).concentration;
	} catch (ex) {
		return 0.0;
	}
});


SampleSchema.virtual('currentGDNAConcentration').get(function() {
	try {
		return _.last(this.gDNAQuantificationInfo).concentration;
	} catch (ex) {
		return 0.0;
	}
});

SampleSchema.virtual('totalDNA').get(function() {
	try {
		var lastGDnaQuantification = _.last(_.filter(this.gDNAQuantificationInfo, function (concentrationResult) {
			return concentrationResult.resultType === 'GDNAQuantification' || !concentrationResult.resultType;
		}));
		return this.volume * lastGDnaQuantification.concentration;
	} catch (ex) {
		return 0.0;
	}
});

// This is pretty much to combine well and column column-wise: i.e. P01_A01 => 1, P02_B01 => 98, etc.
SampleSchema.virtual('generatedColumnSortNumber').get(function() {
    var plateNumber = parseInt(this.sampleCode.substring(12, 14));

		var length = this.sampleCode.length;
		var wellCharOffset = (this.sampleCode.charCodeAt(length - 3) - 'A'.charCodeAt(0) );

		var sampleNumber = parseInt(this.sampleCode.substr(length - 2, length));

    return wellCharOffset + (8 * (sampleNumber - 1)) + 1 + (96 * (plateNumber - 1));
});

// This is pretty much to combine well and column row-wise: i.e. P01_A01 => 1, P02_B01 => 109, etc.
SampleSchema.virtual('generatedRowSortNumber').get(function() {
    var plateNumber = parseInt(this.sampleCode.substring(12, 14));

		var length = this.sampleCode.length;
		var wellCharOffset = ((this.sampleCode.charCodeAt(length - 3) - 'A'.charCodeAt(0)) * 12);
    return parseInt(this.sampleCode.substr(length - 2, length)) + wellCharOffset + (96 * (plateNumber - 1));
});

SampleSchema.virtual('currentTotalDNAInLab').get(function() {
	return this.volumeInLab * this.currentGDNAConcentration;
});

SampleSchema.virtual('volumeInLab').get(function() {
	var tempVolume = this.volume; // Start with the customer volume

	if (this.gDNAQuantificationInfo.length === 0) {
		return tempVolume;
	}

	var previousDrying = _.filter(this.gDNAQuantificationInfo, function(concentrationResult) {
		return concentrationResult.resultType === 'Drying';
	});

	var previousQuantifications = _.filter(this.gDNAQuantificationInfo, function(concentrationResult) {
		return concentrationResult.resultType === 'GDNAQuantification' || !concentrationResult.resultType;
	});

	// We always trust the most recent Quantification Concentration as the most accurate
	var previousQuantificationConcentration = _.last(previousQuantifications).concentration;

	// For each Quantification that is done, we use 1 uL of Volume
	var volumeUsedInQuantifications = _.sum(previousQuantifications, function(quantificationResult) {
		var rfuOne = quantificationResult.replicateOneRFU;
		var rfuTwo = quantificationResult.replicateTwoRFU;

		if (!_.isUndefined(rfuTwo) && rfuTwo !== 0) {
			return 2;
		} else if (!_.isUndefined(rfuOne) && rfuOne !== 0) {
			return 1;
		}

		return 0;
	});

	tempVolume -= volumeUsedInQuantifications;

	// There can only be up to 1 Drying Result in this Array
	if (previousDrying.length === 1) {
		var dryingResult = previousDrying.pop();
		var dryingOccurred = moment(dryingResult.timestamp);

		// Then, we have to change to new drying
		tempVolume = 30;
		var normalizationsAfterDrying = _.filter(this.normalizations, function(normalizationResult) {
			var normalizationOccurred = moment(normalizationResult.timestamp);
			return dryingOccurred.isBefore(normalizationOccurred);
		});

		var volumeUsedAfterDrying = _.sum(normalizationsAfterDrying, 'volumeUsed');
		tempVolume -= volumeUsedAfterDrying;
	} else {
		var volumeUsedInNormalizations = _.sum(this.normalizations, 'volumeUsed');
		tempVolume -= volumeUsedInNormalizations;
	}

    return tempVolume;
});

mongoose.model('Sample', SampleSchema);
