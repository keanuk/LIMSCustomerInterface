'use strict';

angular.module('users.admin').controller('NewUserCtrl', ['$scope', '$http', '$state', '$filter', 'Admin',
  function ($scope, $http, $state, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
    });

    $scope.submitNewUser = function() {
      if($scope.addGroupLeaderForm.$valid) {
        console.log($scope.newUser);
        if ($scope.newUser.email !== $scope.newUser.email2) {
          $scope.emailMismatch = true;
          return;
        }
      }

      $http.post('/api/user/new', $scope.newUser).success(function(response) {
        console.log(response);
      }).error(function(response) {
        console.log(response);
      });
      // .success(function(response) {
      //   //Redirect to the previous or home page
      //   $state.go($state.previous.state.name, $state.previous.params);
      // }).error(function(response) {
      //   $scope.error = response.message;
      // });
    };
  }
]);
