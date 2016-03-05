'use strict';

angular.module('users.admin').controller('NewMemberCtrl', ['$scope', '$filter', 'Project', '$http', '$state', 'Authentication',
  function ($scope, $filter, Project, $http, $state, Authentication) {
    $scope.authentication = Authentication;

    /* Load all projects */
    Project.query(function (data) {
      $scope.allowed = [];
      $scope.allowed = data;
      $scope.nonSelected = [];
      $scope.filterProjects();
      /*if($scope.authentication.user.clientSitePermissions.Project84){
        $scope.hello = 'success';
      }*/
      //$scope.authentication.user.clientSitePermissions = [];
      var hi = $scope.authentication.user.clientSitePermissions;
      $scope.hello = hi;
    });

    /* Validate the new user form and submit the user if it passes */
    $scope.submitNewUser = function() {
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

    $scope.filterProjects = function(){
      /*for(var i = 0; i < $scope.allowed.length; i++){
        if($scope.allowed[i].projectCode === 'Project98'){
          $scope.allowed.splice(i, 1);
        }
      }*/
      $scope.nonSelected = $scope.allowed;
    };

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

}]);
