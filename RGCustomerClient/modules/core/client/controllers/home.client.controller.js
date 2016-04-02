'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Project', '$http', '$state',
  function ($scope, Authentication, Project, $http, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

		$scope.getUserProjects = function() {
      $scope.currentProject = 0;
			if ($scope.authentication) {
				$http({
		      method: 'GET',
		      url: '/api/allowedprojects'
				})
				.then(function successCallback(response) {
	        $scope.hello = response.data;
					console.log($scope.hello);
	      }, function errorCallback(response) {
	        console.log('Error in retrieving projects');
	      });

			}
		};
    $scope.switchProject = function(x) {
      $scope.currentProject = x;
      $scope.currProjectCode = x.projectCode;
      $scope.currShearing = x.shearingMethod;
      $scope.currOrganism = x.organism;
      $scope.currStage = x.analysisStage;
      $scope.currReagent = x.totalReagentsAndLibrary;
      $scope.currTotProbes = x.totalProbes;
      $scope.currSeq = x.totalSequencing;
      $scope.currContract = x.totalContract;
      $scope.currMachine = x.machineType;
      $scope.currIndMode = x.indexingMode;
      $scope.currSeqType = x.sequencingType;
      $scope.dateArrive = x.samplesArrivalDate;
      $scope.currSampCnt = x.totalSamplesExpected;
      $scope.currProbe = x.probe;
      $scope.currSeqPlex = x.sequencingPlex;
      $scope.currCapPlex = x.capturePlex;
      $scope.currSeqMeth = x.sequencingMethod;
      $scope.dateLastEdit = x.lastEdited;
      $scope.dateDue = x.due;
      $scope.dateCreate = x.created;
      $scope.plate0Stg = x.plates[0].stage;
      $scope.plate1Stg = x.plates[1].stage;
      $scope.plate2Stg = x.plates[2].stage;
      $scope.plate3Stg = x.plates[3].stage;
      $scope.plate4Stg = x.plates[4].stage;
      $scope.plate5Stg = x.plates[5].stage;
      $scope.plate6Stg = x.plates[6].stage;
      $scope.plate7Stg = x.plates[7].stage;
      $scope.plate8Stg = x.plates[8].stage;

      // // for (var i in x.plates) {
      // //   if(x.plates[i].stage <= 9) {
      // //     document.getElementById("plate0").style.background = "#D50000";
      // //   }
      // //   else if(x.plates[i].stage > 9 && x.plates[i].stage <= 18) {
      // //     document.getElementById("plate0").style.color = "#FFEB3B";
      // //   }
      // //   else if(x.plates[i].stage === 19) {
      // //     document.getElementById("plate0").style.color = "#00C853";
      // //   }
      // }
    };
	}
]);
