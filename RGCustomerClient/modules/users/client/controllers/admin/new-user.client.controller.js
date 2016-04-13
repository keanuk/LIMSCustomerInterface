'use strict';

angular.module('users.admin').controller('NewUserCtrl', ['$scope', '$filter', 'Project', '$http', '$state',
  function ($scope, $filter, Project, $http, $state) {
    $scope.submitted = 'false';


    /* Load all projects */
    $http({
      method: 'GET',
      url: '/api/myprojects'
    }).then(function successCallback(response) {
        $scope.nonSelected = response.data;
      }, function errorCallback(response) {
        console.log('Error in retrieving projects');
      });

    /* Validate the new user form and submit the user if it passes */
    $scope.submitNewUser = function() {
      $scope.submitted = 'true';
      if(!$scope.newUserForm.$valid) {
        return;
      }

      console.log($scope.newUser);
      if ($scope.newUser.email !== $scope.newUser.email2) {
        $scope.emailMismatch = true;
        return;
      }

      $scope.newUser.projectCodePermissions = [];

      for (var i = 0; i < $scope.isSelected.length; ++i) {
        $scope.newUser.projectCodePermissions.push($scope.isSelected[i].projectCode);
      }

      console.log('Permissions array: ' + JSON.stringify($scope.newUser.projectCodePermissions));

      $http.post('/api/user/new', $scope.newUser)
        .success(function(response) {
          /* Redirect to the previous page */
          console.log(response);
          $state.go($state.previous.state.name, $state.previous.params);
        }).error(function(response) {
          $scope.error = response.message;
        });
    };

    $scope.nonSelected = [];
    $scope.isSelected = [];

    /* Move selected project permissions back and forth between tables */
    $scope.moveProject = function(project, table) {
      if (table === 'availableProjects') {
        for (var i = 0; i < $scope.nonSelected.length; i++) {
          if ($scope.nonSelected[i] === project) {
            $scope.nonSelected.splice(i, 1);
            $scope.isSelected.push(project);
          }
        }
      } else {
        for (var j = 0; j < $scope.isSelected.length; j++) {
          if ($scope.isSelected[j] === project) {
            $scope.isSelected.splice(j, 1);
            $scope.nonSelected.push(project);
          }
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

}]);
