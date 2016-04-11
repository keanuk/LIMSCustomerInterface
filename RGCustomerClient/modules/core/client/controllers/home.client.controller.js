'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Project', '$http', '$state',
  function ($scope, Authentication, Project, $http, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.users = [];
    $scope.displayedUsers = [];
    $scope.shouldDisplayUsers = false;

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

    var addRippleEffect = function (e) {
      var target = e.target;
      if (target.tagName.toLowerCase() !== 'button') return false;
      var rect = target.getBoundingClientRect();
      var ripple = target.querySelector('.ripple');
      if (!ripple) {
          ripple = document.createElement('span');
          ripple.className = 'ripple';
          ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
          target.appendChild(ripple);
      }
      ripple.classList.remove('show');
      var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
      var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
      ripple.style.top = top + 'px';
      ripple.style.left = left + 'px';
      ripple.classList.add('show');
      return false;
    };

document.addEventListener('click', addRippleEffect, false);

    $scope.switchProject = function(x) {
      $scope.currentProject = x;
      $scope.dname = x.displayName;
      $scope.uname = x.username;
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
    };

    // filter the users displayed based on whether or not they have access to the displayed project,
    // stores the users to display in the $scope.displayedUsers array
    $scope.filterUsersByProject = function(projectCode){
       var users = $scope.users;
       $scope.displayedUsers = [];
       for(var i = 0; i < users.length; i++){
         var userProjectNames = Object.keys(users[i].clientSitePermissions);
         if(userProjectNames.includes(projectCode)){
           $scope.displayedUsers.push(users[i]);
         }
       }
    };
	}
]);
