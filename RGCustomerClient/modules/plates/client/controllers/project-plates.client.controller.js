'use strict';

angular.module('plates').controller('ProjectPlatesController', ['$scope', '$http', 'lodash', 'PlateQuickViewSettings', 'StepConverter',
  function($scope, $http, _, PlateQuickViewSettings, StepConverter) {
    $scope.plateArrayOfSamplesJSON = [];
    $scope.singlePlateSamplesArray = null;
		$scope.converter = StepConverter;

    $scope.quickViewSettings = PlateQuickViewSettings.defaults();
		console.log($scope.quickViewSettings);

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
      _.forEach($scope.plates, function(plate) {
        for (var j = 0; j < plate.stage; ++j) {
          ++latestStepCounts[j];
        }
      });
      $scope.latestStepCounts = latestStepCounts;
    }
  }

]);
