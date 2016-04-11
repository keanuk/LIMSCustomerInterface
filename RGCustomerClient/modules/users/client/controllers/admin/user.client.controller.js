'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', '$http', 'userResolve',
  function ($scope, $state, Authentication, $http, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;
    console.log(userResolve);
    //$scope.currentProject;
    $scope.cbSamples = document.getElementById("ckboxSamples");
    $scope.cbPlates = document.getElementById("ckboxPlates");
    $scope.cbProject = document.getElementById("ckboxProject");
    $scope.cbFinances = document.getElementById("ckboxFinances");
    $scope.cbMessage = document.getElementById("ckboxMessage");

    $scope.nonSelected = [];
    $scope.isSelected = [];
    $scope.leaderProjects = [];
    $scope.userProjects = [];

    $scope.loadProjects = function() {
      //console.log($scope.authentication.user._id);


      $http({
        method: 'GET',
        url: '/api/userprojects?userId=' + $scope.authentication.user._id
      }).then(function successCallback(response) {
          $scope.nonSelected = response.data;
          console.log(response.data);
          $scope.user.$promise.then(function (resolvedUser) {

            $http({
              method: 'GET',
              url: '/api/userprojects?userId=' + resolvedUser._id
              //params: {$scope.user._id}
            }).then(function successCallback(response) {
                $scope.isSelected = response.data;
                console.log(response.data);
                $scope.removeDuplicates();
              }, function errorCallback(response) {
                console.log(response);
                console.log('Error in retrieving projects');
            });
          });
        }, function errorCallback(response) {
          console.log('Error in retrieving projects');
      });
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

    $scope.removeDuplicates = function() {
      for (var a = 0; a < $scope.isSelected.length; a++) {
        for (var b = 0; b < $scope.nonSelected.length; b++) {
          //console.log($scope.isSelected[a]);
          //console.log($scope.nonSelected[b]);
          if ($scope.isSelected[a] === $scope.nonSelected[b]) {
            $scope.nonSelected.splice(b, 1);
          }
        }
      }

      for (var c = 0; c < $scope.nonSelected.length; c++) {
        $scope.leaderProjects[c] = $scope.nonSelected[c];
      }
      for (var d = 0; d < $scope.isSelected.length; d++) {
        $scope.userProjects[d] = $scope.isSelected[d];
      }

    };

    /* Move selected project permissions back and forth between tables */
    $scope.moveProject = function(project, table) {
      for (var i = 0; i < $scope.nonSelected.length; i++) {
        if ($scope.nonSelected[i] === project) {
          $scope.nonSelected.splice(i, 1);
          $scope.isSelected.push(project);
        }
      }
    };

    $scope.selectProject = function(project) {
      //$scope.pCode = project.projectCode.value;
      console.log(project);
      $scope.selectedProject = project;
      $scope.userHasProject = false;
      //console.log($scope.userProjects);
      for (var e = 0; e < $scope.userProjects.length; e++) {
        if (project === $scope.userProjects[e]) {
          $scope.userHasProject = true;
          break;
        }
      }
      console.log($scope.userHasProject);
      if (!$scope.userHasProject) {
        console.log('Here2');
        $scope.cbSamples.checked = false;
        $scope.cbPlates.checked = false;
        $scope.cbProject.checked = true;
        $scope.cbFinances.checked = false;
        $scope.cbMessage.checked = false;
      } else {
        console.log('Here3');
        var pCode = project;
        if ($scope.user.clientSitePermissions[pCode].samplesAccess === true) {
          $scope.cbSamples.checked = true;
        } else {
          $scope.cbSamples.checked = false;
        }
        if ($scope.user.clientSitePermissions[pCode].platesAccess === true) {
          $scope.cbPlates.checked = true;
        } else {
          $scope.cbPlates.checked = false;
        }
        if ($scope.user.clientSitePermissions[pCode].projectAccess === true) {
          $scope.cbProject.checked = true;
        } else {
          $scope.cbProject.checked = false;
        }
        if ($scope.user.clientSitePermissions[pCode].projectFinancesAccess === true) {
          $scope.cbFinances.checked = true;
        } else {
          $scope.cbFinances.checked = false;
        }
        if ($scope.user.clientSitePermissions[pCode].messageBoardAccess === true) {
          $scope.cbMessage.checked = true;
        } else {
          $scope.cbMessage.checked = false;
        }
      }
    };

    $scope.removeProject = function() {
      if ($scope.selectedProject !== null) {
        var project = $scope.selectedProject;
        $scope.selectedProject = null;
        for (var j = 0; j < $scope.isSelected.length; j++) {
          if ($scope.isSelected[j] === project) {
            $scope.isSelected.splice(j, 1);
            $scope.nonSelected.push(project);
            $scope.leaderProjects.push(project);
            $scope.userProjects.splice(j, 1);
          }
        }
        if ($scope.user.clientSitePermissions !== undefined && $scope.user.clientSitePermissions[project] !== undefined) {
          delete $scope.user.clientSitePermissions[project];

          //console($scope.user.clientSitePermissions[project]);

          var url = '/api/updatepermissions';

          $scope.user.$promise.then(function (resolvedUser) {
          console.log(resolvedUser);

            $http.put(url, {params: {"user": resolvedUser}
            }).then(function successCallback(response) {
              console.log(response.data);
            }, function errorCallback(response) {
              console.log('error updating permissions');
            });
          });
        }
      }
    };

    $scope.permissionsUpdate = function () {
      var pCode = $scope.selectedProject;
      $scope.selectedProject = null;
      var url = '/api/updatepermissions';
      /*if (userHasProject) {
        var url = '/api/updatepermissions';
      } else {
        var url = '/api/createpermissions';
      }*/

      if ($scope.userProjects.length === 0) {
        var csp = {};
        csp[pCode] = {
          isGroupLeader: false,
          messageBoardAccess: $scope.cbMessage.checked,
          platesAccess: $scope.cbPlates.checked,
          projectAccess: $scope.cbProject.checked,
          projectFinancesAccess: $scope.cbFinances.checked,
          samplesAccess: $scope.cbSamples.checked
        };
        //csp.push(permissions);
        $scope.user.clientSitePermissions = csp;
      } else {
        $scope.user.clientSitePermissions[pCode] = {
          isGroupLeader: false,
          messageBoardAccess: $scope.cbMessage.checked,
          platesAccess: $scope.cbPlates.checked,
          projectAccess: $scope.cbProject.checked,
          projectFinancesAccess: $scope.cbFinances.checked,
          samplesAccess: $scope.cbSamples.checked
        };
      }

      for (var i = 0; i < $scope.nonSelected.length; i++) {
        if ($scope.nonSelected[i] === pCode) {
          $scope.userProjects.push(pCode);
          $scope.leaderProjects.splice(i, 1);
        }
      }

      console.log($scope.user.clientSitePermissions[pCode]);

      //console.log(user);

      $scope.user.$promise.then(function (resolvedUser) {
        console.log(resolvedUser);

        $http.put(url, {params: {"user": resolvedUser}
        }).then(function successCallback(response) {
          console.log(response.data);
        }, function errorCallback(response) {
          console.log('error updating permissions');
        });
      });

      /*user.$update(function(res) {
        console.log(res);
        console.log('Permissions updated');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });*/
    };


    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
