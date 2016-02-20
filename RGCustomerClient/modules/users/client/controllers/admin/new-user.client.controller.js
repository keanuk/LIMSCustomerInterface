'use strict';

angular.module('users.admin').controller('NewUserCtrl', ['$scope', '$filter', 'Project', '$http', '$state', 'Admin',
  function ($scope, $filter, Project, $http, $state, Admin) {
    Project.query(function (data) {
      $scope.projects = data;
      $scope.buildPager();
    });
    
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
    };

    $scope.buildPager = function(){
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function(){
      $scope.filteredItems = $filter('filter')($scope.projects, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };
    
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
    }
  
]);