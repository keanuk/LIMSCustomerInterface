'use strict';

const mongoose = require('mongoose');

//Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.floor( Math.random() * (max - min) + min );
}

exports.getNewPlateTemplate = function(plateCode, projectId) {
	var newPlateFields = {
			'project' : projectId,
			'plateCode' : plateCode,
			'conditionalNotes' : [],
			'logs' : [],
			'isAssigned' : false,
			'assignee' : null,
			'samples' : [],
			'stage' : getRandomArbitrary(0,19),
			'i5Barcode' : ('567196218f2b5e5acfd4c491')
		};
		return newPlateFields;
};
