'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Menus', 'Project', '$http', '$state',
  function($scope, Authentication, Menus, Project, $http, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.users = [];
    $scope.displayedUsers = [];
    $scope.names = []; // project names for dropdown
    $scope.shouldDisplayUsers = false;
    $scope.isAdmin = false;
    if ($scope.authentication.user) {
      Menus.setMenu($scope.authentication.user); // header will check Menu to see if it changed
      if($scope.authentication.user.roles.includes('admin')){
        $scope.isAdmin = true;
      }
    }
    
    $scope.samplesAccess = false;
    $scope.platesAccess = false;
    $scope.projectAccess = false;
    $scope.projectFinancesAccess = false;

    $scope.getUsers = function() {
      if($scope.authentication){
        if ($scope.authentication.user) {
          var roles = $scope.authentication.user.roles;
          if (roles.includes('admin') || roles.includes('groupleader')) { // actual authentication done one back-end
            $scope.shouldDisplayUsers = true;
          }
        }

        if ($scope.shouldDisplayUsers === true) {
          $http({ // retrieve users that this person has access to
              method: 'GET',
              url: '/api/users'
            })
            .then(function successCallback(response) {
              $scope.users = response.data;
              $scope.getProjectNames();

            }, function errorCallback(response) {
              console.log('Error in retrieving projects');
            });
        }
        else{
          $scope.getProjectNames();
        }
      }
    };

/*    $scope.getProjects = function() {
      if ($scope.authentication) {
        $http({ // retrieve projects that this person has access to
            method: 'GET',
            url: '/api/allowedprojects'
          })
          .then(function successCallback(response) {
	   	      console.log(response.data);
            $scope.projects = response.data;
		        if ($scope.projects[0]) {
              if($scope.authentication.user.roles.includes('admin')){  // check once to see if admin on page loadup
                isAdmin = true;

                console.log('Admin is here');
              }
			        $scope.switchProject($scope.projects[0]);
		        }
          }, function errorCallback(response) {
            console.log('Error in retrieving projects');
          });

        

      }
    };*/

    $scope.getProjectNames = function() {
      if($scope.authentication){
        if($scope.authentication.user){
          if($scope.isAdmin){
            $http({
                  method: 'GET',
                  url: '/api/projectnames'
                })
                .then(function successCallback(response) {
                  $scope.names = response.data;
                  $scope.getOneProject($scope.names[0]);
                }, function errorCallback(response) {
                  console.log('Error in retrieving project names');
                });
            }
            else{
              if($scope.authentication.user.clientSitePermissions){
                var projNames = Object.keys($scope.authentication.user.clientSitePermissions);
                $scope.names = projNames;
                $scope.getOneProject($scope.names[0]);
              }
            }
          }
        }
    };

    $scope.getOneProject = function(projectCode) {
      $scope.showEverything = false;
      $scope.showSpinner = true;
      $http({
            method: 'GET',
            url: '/api/singleproject',
            params: {pCode: projectCode}
          })
          .then(function successCallback(response) {
            $scope.switchProject(response.data[0]);

          }, function errorCallback(response) {
            console.log('Error in retrieving project names');
          });
    };

    var addRippleEffect = function(e) {
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



	var platedata = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];


    $scope.labels = ['Pending Arrival', 'Sample Arrived', 'Quality Control 1', 'Shearing',
      'Library Preparation', 'Quality Control 2', 'Hybridization', 'Quality Control 3',
      'Sequencing', 'Data Analysis', 'Completed'
    ];
    $scope.series = ['Series A'];
    $scope.colors = [{
      fillColor: "#b2b3b4",
      strokeColor: "#000000",
      highlightFill: "#ff9966",
      highlightStroke: "#000000",
    }];
    $scope.data = platedata; // Need to update this every time we get a new project.



    //fillColor: ["#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4",
    //		"#b2b3b4", "#b2b3b4", "#b2b3b4", "#b2b3b4", "#ff2b00"]
    // highlightFill: ["#ff9966", "#ff9966", "#ff9966", "#ff9966", "#ff9966", "#ff9966",
    // 			"#ff9966", "#ff9966", "#ff9966", "#ff9966", "#ff8000"],
    // The colors that they should be if they worked.
    // DO NOT DELETE ANY COMMENTS!!!!!!!

//	if ($scope.hello[0])
//		$scope.currentProject = $scope.hello[0];

    $scope.switchProject = function(currentProject) {
      //  ensure project data doesn't initially show if not admin
      $scope.samplesAccess = $scope.isAdmin;
      $scope.platesAccess = $scope.isAdmin;
      $scope.projectAccess = $scope.isAdmin;
      $scope.projectFinancesAccess = $scope.isAdmin;
//
      $scope.currentProject = currentProject;

      $scope.showSpinner = false;
      $scope.showEverything = true;

      platedata[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      // This needs to be a double array like this because of the way angular-chart.js
      // is set up. It wants to do multiple series of bars and we only need one. Thus,
      // platedata[0] is the way to go.

      // The mapping of the stages to their labels.

      // 0: Pending Arrival
      // 1: Sample Arrival
      // 2: Quality Control 1
      // 3: Shearing
      // 4: Library Prep
      // 5: Quality Control 2
      // 6: Hybridization
      // 7: Quality Control 3
      // 8: Sequencing
      // 9: Data Analysis
      // 10: Completed

      for (var q in $scope.currentProject.plates) {

        var ref = $scope.currentProject.plates[q].stage;

        // Mapping of the commercial LIMS database to the client display stages
        // Note: DB indexing starts at 1, this indexing starts at 0.
        switch (ref) {
          case 0:
            {
              platedata[0][0]++;
              break;
            }
          case 1:
            {
              platedata[0][1]++;
              break;
            }
          case 2:
            {
              platedata[0][2]++;
              break;
            }
          case 3:
            {
              platedata[0][3]++;
              break;
            }
          case 4:
            {
              platedata[0][3]++;
              break;
            }
          case 5:
            {
              platedata[0][4]++;
              break;
            }
          case 6:
            {
              platedata[0][4]++;
              break;
            }
          case 7:
            {
              platedata[0][4]++;
              break;
            }
          case 8:
            {
              platedata[0][4]++;
              break;
            }
          case 9:
            {
              platedata[0][4]++;
              break;
            }
          case 10:
            {
              platedata[0][4]++;
              break;
            }
          case 11:
            {
              platedata[0][5]++;
              break;
            }
          case 12:
            {
              platedata[0][6]++;
              break;
            }
          case 13:
            {
              platedata[0][6]++;
              break;
            }
          case 14:
            {
              platedata[0][6]++;
              break;
            }
          case 15:
            {
              platedata[0][6]++;
              break;
            }
          case 16:
            {
              platedata[0][7]++;
              break;
            }
          case 17:
            {
              platedata[0][8]++;
              break;
            }
          case 18:
            {
              platedata[0][9]++;
              break;
            }
          case 19:
            {
              platedata[0][10]++;
              break;
            }
          default:
            {
              platedata[0][0]++;
            } // Safety default case.
        }
      }

      $scope.data = platedata; // Need to update this every time we get a new project.

			$scope.plates = currentProject.plates;
      $scope.dname = currentProject.displayName;
      $scope.uname = currentProject.username;
      $scope.currProjectCode = currentProject.projectCode;
      $scope.currShearing = currentProject.shearingMethod;
      $scope.currOrganism = currentProject.organism;
      $scope.currStage = currentProject.analysisStage;
      $scope.currReagent = currentProject.totalReagentsAndLibrary;
      $scope.currTotProbes = currentProject.totalProbes;
      $scope.currSeq = currentProject.totalSequencing;
      $scope.currContract = currentProject.totalContract;
      $scope.currMachine = currentProject.machineType;
      $scope.currIndMode = currentProject.indexingMode;
      $scope.currSeqType = currentProject.sequencingType;
      var date = new Date(currentProject.samplesArrivalDate);
      $scope.dateArrive = (date.getMonth() + 1) + '-' + date.getDate() +'-' + date.getFullYear();
      //$scope.dateArrive = currentProject.samplesArrivalDate;
      $scope.currSampCnt = currentProject.totalSamplesExpected;
      $scope.currProbe = currentProject.probe;
      $scope.currSeqPlex = currentProject.sequencingPlex;
      $scope.currCapPlex = currentProject.capturePlex;
      $scope.currSeqMeth = currentProject.sequencingMethod;
      date = new Date(currentProject.lastEdited);
      $scope.dateLastEdit = (date.getMonth() + 1) + '-' + date.getDate() +'-' + date.getFullYear();
      //$scope.dateLastEdit = currentProject.lastEdited;
      date = new Date(currentProject.due);
      $scope.dateDue = (date.getMonth() + 1) + '-' + date.getDate() +'-' + date.getFullYear();
      //$scope.dateDue = currentProject.due;
      $scope.plate0Stg = currentProject.plates[0].stage + 1;
      $scope.plate1Stg = currentProject.plates[1].stage + 1;
      $scope.plate2Stg = currentProject.plates[2].stage + 1;
      $scope.plate3Stg = currentProject.plates[3].stage + 1;
      $scope.plate4Stg = currentProject.plates[4].stage + 1;
      $scope.plate5Stg = currentProject.plates[5].stage + 1;
      $scope.plate6Stg = currentProject.plates[6].stage + 1;
      $scope.plate7Stg = currentProject.plates[7].stage + 1;
      $scope.plate8Stg = currentProject.plates[8].stage + 1;
      $scope.plate8Stg = currentProject.plates[8].stage;

      if ($scope.shouldDisplayUsers === true) {
        $scope.filterUsersByProject(currentProject.projectCode); // change the displayed users
      }
      if(!$scope.isAdmin){
        $scope.restrictProjectData(currentProject.projectCode);
      }
    };

    // filter the users displayed based on whether or not they have access to the displayed project,
    // stores the users to display in the $scope.displayedUsers array
    $scope.filterUsersByProject = function(projectCode) {
      var users = $scope.users;
      $scope.displayedUsers = [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].clientSitePermissions) {
          var userProjectNames = Object.keys(users[i].clientSitePermissions);
          if (userProjectNames.includes(projectCode)) {
            $scope.displayedUsers.push(users[i]);
          }
        }
      }
    };

    //Sets variables to restrict user access to different aspects of project based on client site permissions
    $scope.restrictProjectData = function(projectCode) {
      var csp = $scope.authentication.user.clientSitePermissions;
      for (var property in csp) {
        if (property === projectCode) {
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
