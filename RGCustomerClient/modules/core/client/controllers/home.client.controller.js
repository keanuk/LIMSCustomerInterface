'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Menus', 'Project', '$http', '$state',
  function ($scope, Authentication, Menus, Project, $http, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.users = [];
    $scope.displayedUsers = [];
    $scope.shouldDisplayUsers = false;
    if($scope.authentication.user){
      Menus.setMenu($scope.authentication.user);  // header will check Menu to see if it changed
    }

    $scope.samplesAccess = false;
    $scope.platesAccess = false;
    $scope.projectAccess = false;
    $scope.projectFinancesAccess = false;

		$scope.getUsersAndProjects = function() {
			if ($scope.authentication) {
				$http({  // retrieve projects that this person has access to
		      method: 'GET',
		      url: '/api/allowedprojects'
				})
				.then(function successCallback(response) {
	        $scope.hello = response.data;
	      }, function errorCallback(response) {
	        console.log('Error in retrieving projects');
	      });

        if($scope.authentication.user){
          var roles = $scope.authentication.user.roles;
          if(roles.includes('admin') || roles.includes('groupleader')){  // actual authentication done one back-end
            $scope.shouldDisplayUsers = true;
          }
        }

        if($scope.shouldDisplayUsers === true){
          $http({  // retrieve users that this person has access to
            method: 'GET',
            url: '/api/users'
          })
          .then(function successCallback(response) {
            $scope.users = response.data;
          }, function errorCallback(response) {
            console.log('Error in retrieving projects');
          });
        }
			}
		};

    $scope.switchProject = function(x) {

      //  ensure project data doesn't initially show
      $scope.samplesAccess = false;
      $scope.platesAccess = false;
      $scope.projectAccess = false;
      $scope.projectFinancesAccess = false;

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

      if($scope.shouldDisplayUsers === true){
        $scope.filterUsersByProject(x.projectCode);  // change the displayed users
      }

      $scope.restrictProjectData(x.projectCode);

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

    // filter the users displayed based on whether or not they have access to the displayed project,
    // stores the users to display in the $scope.displayedUsers array
    $scope.filterUsersByProject = function(projectCode){
       var users = $scope.users;
       $scope.displayedUsers = [];
       for(var i = 0; i < users.length; i++){
        if(users[i].clientSitePermissions){
          var userProjectNames = Object.keys(users[i].clientSitePermissions);
          if(userProjectNames.includes(projectCode)){
            $scope.displayedUsers.push(users[i]);
          }
        }
       }
    };

    //  sets variables to restrict user access to different aspects of project
    $scope.restrictProjectData = function(projectCode){
      var csp = $scope.authentication.user.clientSitePermissions;
      for(var property in csp){
        if(property === projectCode){
          $scope.samplesAccess = csp[property].samplesAccess;
          $scope.platesAccess = csp[property].platesAccess;
          $scope.projectAccess = csp[property].projectAccess;
          $scope.projectFinancesAccess = csp[property].projectFinancesAccess;
          break;
        }
      }
    };
	}
]);
