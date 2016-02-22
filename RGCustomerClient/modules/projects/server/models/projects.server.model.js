'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({

	//Project's main information display
	created: {
		type: Date,
		default: Date.now
	},
	projectCreatedDateComment: {
		type: String,
		default: ''
	},

	mismatchPercentage: {
		type: String,
		default: ''
	},
	mismatchPercentageComment: {
		type:String,
		default: ''
	},

	due: {
		type: Date,
		default: ''
	},
	dueComment: {
		type: String,
		default: '',
	},
	daysUntilDueComment: {
		type: String,
		default: ''
	},
	daysSinceCreationComment: {
		type:String,
		default: ''
	},

	lastEdited: {
		type: Date,
		default: Date.now
	},
	lastEditedComment: {
		type: String,
		default: ''
	},

	lastEditor: {
		type: Schema.ObjectId,
		ref: 'User'
	},

	projectCode: {
		type: String,
		default: '',
		trim: true,
		required: 'Project Code cannot be blank, always in format (ABC_010203)'
	},
	projectCodeComment: {
		type: String,
		default: '',
	},

	customer: {
		type: Schema.ObjectId,
		ref: 'Customer',
		required: 'A customer must be specified'
	},
	customerComment: {
		type: String,
		default: ''
	},

    quote: {
        type: Schema.ObjectId,
        ref: 'Quote'
    },

    quoteComment: {
        type: String,
        defualt: ''
    },

	organism: {
		type: Schema.ObjectId,
		ref: 'Organism',
		required: 'An organism must be specified'
	},
	organismComment: {
		type: String,
		default: ''
	},

	sequencingMethod: {
		type: String,
		default: 'CAPTUREseq',
		trim: true
	},
	sequencingMethodComment: {
		type: String,
		default: ''
	},

	plates: [{
		type: Schema.ObjectId,
		ref: 'Plate',
	}],
	platesComment: {
		type: String,
		default: ''
	},

	description: {
		type: String,
		default: '',
		trim: true
	},

	projectStatus: {
		type: Boolean,
        default: false,
        required: 'Project must be open or closed'
	},
	projectStatusComment: {
		type: String,
        default: ''
	},

	user: {
		type: Schema.ObjectId,
		ref: 'User',
	},

	userComment: {
        type: String,
		default: ''
	},

	logs: [{
		type: Schema.ObjectId,
		ref: 'Log'
	}],

	capturePlex: {
		type: String,
		default: 'N/A'
	},
	capturePlexComment: {
		type: String,
        default: ''
	},

	sequencingPlex : {
		type: String,
		default: 'N/A'
	},
	sequencingPlexComment: {
		type: String,
		default: ''
	},

    lastLaneUsage: {
        type: Number,
        default: -1
    },
    lastLaneUsageComment: {
        type: String,
        default: ''
    },

	probe: {
		type: String,
		default: 'N/A'
	},
	probeComment: {
		type: String,
		default: ''
	},
	probeProviderComment: {
		type: String,
		default: ''
	},
	numberOfProbesComment: {
		type: String,
		default: ''
	},
	probesOrderedDate: {
		type: Date,
		default: ''
	},

	probesOrderedDateComment: {
		type: String,
		default: ''
	},
	daysUntilProbeArrivalComment: {
		type: String,
        default: ''
	},

	totalSamplesExpected: {
		type: String,
		default: 'N/A'
	},
	totalSamplesExpectedComment: {
		type: String,
		default: ''
	},
	arrivedSamplesComment: {
		type: String,
		default: ''
	},
	samplesArrivalDate: {
		type: Date,
		default: ''
	},
	samplesArrivalDateComment: {
		type: String,
		default: ''
	},
	samplesOrderedDate: {
		type: Date,
		default: ''
	},
	samplesOrderedDateComment: {
		type: String,
		default: ''
	},
	daysSinceSamplesOrderedComment: {
		type: String,
		default: ''
	},


	sequencingType: {
		type: String,
		default: 'N/A'
	},
	sequencingTypeComment: {
		type: String,
		default: ''
	},
	enzyme: {
		type: String,
		default: 'Kapa'
	},
	enzymeComment: {
		type: String,
		default: ''
	},

    // dual or single barcode
	indexingMode: {
		type: String,
		default: 'N/A'
	},
	indexingModeComment: {
		type: String,
		default: ''
	},

	machineType: {
		type: String,
		default: 'N/A'
	},
	machineTypeComment: {
		type: String,
		default: ''
	},

	//Image and image name arrays are designed to operate in parallel. gelImages[3] should be named by gelImageNames[3]
    gelImages: [{
        type: String,
        default: ''
    }],
    gelImageNames: [{
        type: String,
    	default: ''
    }],
    arrivalImages: [{
    	type: String,
    	default: ''
    }],
    arrivalImageNames: [{
    	type: String,
    	default: ''
    }],

	//Admin tab
	price: {
		type: String,
		default: 'N/A'
	},
	priceComment: {
		type: String,
		default: ''
	},

    // Customer total
	totalContract: {
		type: String,
		default: 'N/A'
	},
	totalContractComment: {
		type: String,
		default: ''
	},

    // Stage in the invoice pipeline
	shearingMethod: {
		type: String,
		default: 'N/A'
	},
	shearingMethodComment: {
		type: String,
		default: ''
	},

	totalSequencing: {
		type: String,
		default: 'N/A'
	},
	totalSequencingComment: {
		type: String,
		default: ''
	},

	totalProbes: {
		type: String,
		default: 'N/A'
	},
	totalProbesComment: {
		type: String,
		default: ''
	},

	totalReagentsAndLibrary: {
		type: String,
		default: 'N/A'
	},
	totalReagentsAndLibraryComment: {
		type: String,
		default: ''
	},

	contract: {
		type: String,
		default: 'N/A'
	},
	contractComment: {
        type: String,
		default: ''
	},

	//End of admin tab --- Beginning of the data analysis tab
	probeFile: {
		type: String,
		default: 'N/A'
	},
	probeFileComment: {
		type: String,
		default: ''
	},

	referenceGenomeFile: {
		type: String,
		default: 'N/A'
	},
	referenceGenomeFileComment: {
		type: String,
		default: ''
	},

	bedFile: {
		type: String,
		default: 'N/A'
	},
	bedFileComment: {
		type: String,
		default: ''
	},

	analysisStage: {
		type: String,
		default: 'N/A'
	},
	analysisStageComment: {
		type: String,
		default: ''
	},
	//End of data analysis tab

    isUrgent: {
        type: Boolean,
        default: false
    }


});

var deepPopulate = require('mongoose-deep-populate')(mongoose);
ProjectSchema.plugin(deepPopulate, {
    whitelist: [
        'plates',
        'plates.samples',
        'customer',
        'organism'
    ]
});

//create a hook that intercepts a remove and deletes all plates before the project is deleted
ProjectSchema.pre('remove', function(next){
    //find all plates belonging to this project
    this.model('Plate').find({_id: {$in: this.plates}},function(err, docs){
        if(err) {
            console.log('Failed to find nested plates: ' + err);
        } else {
            //loop over every plate in the project
            //we must find & loop this way because...
            for(var doc in docs){
                console.log(docs[doc]);
                //...it allows us to use a mongoose remove command [below]
                //which will successfully trigger the pre-remove middleware
                //on the plate objects. a direct remove w/ query conditions
                //would not trigger the middleware.
                docs[doc].remove();
            }
        }
    });
    next();
});

mongoose.model('Project', ProjectSchema);
