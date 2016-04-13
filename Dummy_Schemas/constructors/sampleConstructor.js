'use strict';

exports.getNewSampleTemplate = function(sampleCode) {
	//Returns a random number between min (inclusive) and max (exclusive)
	function getRandomArbitrary(min, max) {
	  return Math.floor( Math.random() * (max - min) + min );
	}

	var template = {
    'totalDNA' : getRandomArbitrary(100,900),
    'concentration' : getRandomArbitrary(1,100),
    'volume' : getRandomArbitrary(50,150),
    'sampleCode' : sampleCode,
    'gDNAQuantificationInfo' : [
        {
            'replicateOneRFU' : getRandomArbitrary(1000,15000),
            'concentration' : getRandomArbitrary(1,15),
            'timestamp' : new Date(),
            '_id' : '56c3634bd2433cd15fad83b4'
        }
    ],
    'normalizations' : []
	};
	return template;
};
