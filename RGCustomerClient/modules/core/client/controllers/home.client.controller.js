'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Project', '$http', '$state',
  function ($scope, Authentication, Project, $http, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

		$scope.getUserProjects = function() {
			if ($scope.authentication) {
				$http({
		      method: 'GET',
		      url: '/api/allowedprojects'
				})
				.then(function successCallback(response) {
	        $scope.projects = response.data;
					console.log($scope.projects);
	      }, function errorCallback(response) {
	        console.log('Error in retrieving projects');
	      });

			}
		};
    $scope.switchProject = function(selectedProject) {
			$scope.showPlates = false;
      $scope.currentProject = selectedProject;
      $scope.currProjectCode = selectedProject.projectCode;
      $scope.currShearing = selectedProject.shearingMethod;
      $scope.currOrganism = selectedProject.organism;
      $scope.currStage = selectedProject.analysisStage;
      $scope.currReagent = selectedProject.totalReagentsAndLibrary;
      $scope.currTotProbes = selectedProject.totalProbes;
      $scope.currSeq = selectedProject.totalSequencing;
      $scope.currContract = selectedProject.totalContract;
      $scope.currMachine = selectedProject.machineType;
      $scope.currIndMode = selectedProject.indexingMode;
      $scope.currSeqType = selectedProject.sequencingType;
      $scope.dateArrive = selectedProject.samplesArrivalDate;
      $scope.currSampCnt = selectedProject.totalSamplesExpected;
      $scope.currProbe = selectedProject.probe;
      $scope.currSeqPlex = selectedProject.sequencingPlex;
      $scope.currCapPlex = selectedProject.capturePlex;
      $scope.currSeqMeth = selectedProject.sequencingMethod;
      $scope.dateLastEdit = selectedProject.lastEdited;
      $scope.dateDue = selectedProject.due;
      $scope.dateCreate = selectedProject.created;
			$scope.plates = selectedProject.plates;
      $scope.plate0Stg = selectedProject.plates[0].stage;
      $scope.plate1Stg = selectedProject.plates[1].stage;
      $scope.plate2Stg = selectedProject.plates[2].stage;
      $scope.plate3Stg = selectedProject.plates[3].stage;
      $scope.plate4Stg = selectedProject.plates[4].stage;
      $scope.plate5Stg = selectedProject.plates[5].stage;
      $scope.plate6Stg = selectedProject.plates[6].stage;
      $scope.plate7Stg = selectedProject.plates[7].stage;
      $scope.plate8Stg = selectedProject.plates[8].stage;

			if ($scope.plates.length > 0 && (typeof $scope.plates[0] === 'object')) {
				$scope.showPlates = true;
			}

      // // for (var i in selectedProject.plates) {
      // //   if(selectedProject.plates[i].stage <= 9) {
      // //     document.getElementById("plate0").style.background = "#D50000";
      // //   }
      // //   else if(selectedProject.plates[i].stage > 9 && selectedProject.plates[i].stage <= 18) {
      // //     document.getElementById("plate0").style.color = "#FFEB3B";
      // //   }
      // //   else if(selectedProject.plates[i].stage === 19) {
      // //     document.getElementById("plate0").style.color = "#00C853";
      // //   }
      // }
    };
	}
]);
