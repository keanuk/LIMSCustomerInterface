'use strict';

//Plates service used for communicating with the plates REST endpoints
angular.module('plates').factory('Plates', ['$resource',
	function($resource) {
		return $resource('plates/:plateId', {
			plateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			get: {
				method: 'GET'
			}
		});
	}
]);

//An array that can be passed between the project client controller and create log client controller so 
//we can indicate the creation of multiple conditional notes during note creation with a check list
angular.module('plates').factory('SharedPlatesArray', function () {
	var platesArray = [];
        return {
            getPlatesArray: function () {
                return platesArray;
            },
            setPlatesArray: function(value) {
                platesArray = value;
                return;
            }
        };
  });
