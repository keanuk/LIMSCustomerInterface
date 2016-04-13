'use strict';

angular.module('projects').controller('ProjectPlatesController', ['$scope', '$http', 'lodash', 'Plates', 'worklistFactory', 'PlateQuickViewSettings',
	function ($scope, $http, _, Plates, worklistFactory, PlateQuickViewSettings) {
		$scope.plateArrayOfSamplesJSON = [];
		$scope.singlePlateSamplesArray = null;

		$scope.quickViewSettings = PlateQuickViewSettings.defaults();

	    function getPlate(plateId) {
	        Plates.get({ plateId: plateId }).$promise.then(function (plate) {
	            replacePlate(plate);
	        });
	    }

		$scope.$on('populatePlates', function (event, plateIds) {
		    _.forEach(plateIds, function (plateId) {
		        getPlate(plateId);
		    });
		});

	    $scope.$watchCollection('project.plates', function (newValue, oldValue) {
	        if (!newValue) {
	            return;
	        }
	        async.map($scope.project.plates, function (plateId, callback) { // jshint ignore:line
	            Plates.get({ plateId: plateId }).$promise.then(function (plate) {
	                callback(null, plate);
	            });
	        }, function (err, plates) {
	            $scope.plates = plates;
	            getLatestStepCounts();
	        });
	    });

        var selectedPlates = {
	        'AddToWorklist': [],
	        'CreateLog': []
	    };

	    $scope.plateTableMode = {
	        mode: 'AddToWorklist'
	    };

	    $scope.selectedPlates = selectedPlates.AddToWorklist;

	    $scope.$on('modalClosed', function() {
	    	$scope.singlePlateSamplesArray = null;
	    });

	    $scope.populatePlateSamplesArray = function(passedPlateCode) {
	    	var req = {
	    		method: 'GET',
	    		url: '/plates/getSamples',
	    		params: {
	    			plateCode: passedPlateCode
	    		}
	    	};	

	    	$http(req).then(function(response) {
	    		$scope.singlePlateSamplesArray = response.data;
	    		$scope.$broadcast('samplesArrayLoaded' + passedPlateCode);
	    	}, function(err) {
	    		console.log('Error retreiving samples: ' + JSON.stringify(err));
	    	});
	    };

	    $scope.colorFunctions = [
            function(sample) {
                if (!_.isUndefined(sample)) {
                    return '#A9F5BC'; // A Light Green
                }
            }
	    ];


	    $scope.selectAllPlates = function () {
	        _.forEach($scope.plates, function (plate) {
	            if ($scope.isPlateSelected(plate)) {
	                return;
	            }
	            $scope.selectPlate(plate);
	        });
	    };

	    $scope.isPlateSelected = function (plate) {
	        var mode = $scope.plateTableMode.mode;
	        return _.contains(_.map(selectedPlates[mode], 'plateCode'), plate.plateCode);
	    };

	    $scope.selectPlate = function (plate) {
	        var mode = $scope.plateTableMode.mode;
	        var selectedPlateArr = selectedPlates[mode];

	        if (mode === 'AddToWorklist' && plate.isAssigned) {
	            return;
	        }

	        if ($scope.isPlateSelected(plate)) {
	            selectedPlateArr.splice(_.map(selectedPlateArr, 'plateCode').indexOf(plate.plateCode), 1);
	        } else {
	            selectedPlateArr.push(plate);
	        }
	    };

	    $scope.togglePlateTableMode = function (newMode) {
	        $scope.plateTableMode.mode = newMode;

	        $scope.selectedPlates = selectedPlates[newMode];
	    };

	    function getLatestStepCounts() {
	        //the array to return
	        //will have a count of # plates @ each index (each index = a step)
	        var latestStepCounts = [];
	        //create an empty array with as many slots as there are steps
	        //we will probably have to replace '14' with reading the number
	        //of steps associated with a sequencing method later
	        for (var i = 0; i < 18; ++i) {
	            latestStepCounts.push(0);
	        }
	        _.forEach($scope.plates, function (plate) {
	            for (var j = 0; j < plate.stage; ++j) {
	                ++latestStepCounts[j];
	            }
	        });
	        $scope.latestStepCounts = latestStepCounts;
	    }

	    $scope.addPlatesToWorklist = function () {
	        var mode = $scope.plateTableMode.mode;
	        if (mode !== 'AddToWorklist') {
	            return;
	        }

	        _.forEach($scope.selectedPlates, function (plate, index) {
	            worklistFactory.addPlateToWorkList(plate, function (err, updatedPlate) {
	                replacePlate(updatedPlate);
	            });
	        });

	        $scope.selectedPlates.length = 0;

	        $scope.$emit('workListUpdated');
	    };

	    function replacePlate(updatedPlate) {
	        var index = _.map($scope.plates, 'plateCode').indexOf(updatedPlate.plateCode);
            if (index >= 0) {
	            $scope.plates[index] = updatedPlate;
            }

	        _.forEach(_.values(selectedPlates), function (plates) {
	            index = _.map(plates, 'plateCode').indexOf(updatedPlate.plateCode);
	            if (index >= 0) {
	                plates[index] = updatedPlate;
	            }
	        });
	    }

	    $scope.$on('logAppended', function (event, plate) {
	        getPlate(plate);
	    });

	    $scope.$on('logRemoved', function (event, data) {
	        var plate = data.plate;
	        var log = data.log;
	        var conditionalNote = data.conditionalNote;

	        var index = plate.logs.indexOf(log._id);
	        plate.logs.splice(index, 1);

	        if (conditionalNote) {
	            index = plate.conditionalNotes.indexOf(conditionalNote._id);
	            plate.conditionalNotes.splice(index, 1);
	        }

	        $scope.updatePlate(plate);
	    });

	    $scope.notifyChildController = function (plate) {
	        $scope.$broadcast('loadPlateLogs', plate);
	    };

	    $scope.barcodeOptions = {
	        i5BarcodeOptions: []
	    };

	    $scope.barcodeFor = function(plate) {
		return $scope.barcodeOptions.i5BarcodeOptions[_.map($scope.barcodeOptions.i5BarcodeOptions, '_id').indexOf(plate.i5Barcode)].barcodeNumber;
	    };

	    $http.get('/barcodes/i5').then(function (response) {
	        _.forEach(response.data, function (barcode) {
	            if (barcode.barcodeNumber === 0) {
	                barcode.barcodeNumber = 'SingleIndex'; // The Default Barcode is 0, but displayed as SingleEnd
	            }
	        });

	        $scope.barcodeOptions.i5BarcodeOptions = response.data;
	    });

	    $scope.updatePlate = function (plate) {
	        plate.$update().then(function (updatedPlate) {
	            replacePlate(updatedPlate);
	        });
	    };
	}

]);
