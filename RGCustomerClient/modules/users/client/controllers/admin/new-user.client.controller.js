'use strict';

angular.module('projects.admin').controller('NewUserCtrl', ['$scope', '$filter', 'Project',
  function ($scope, $filter, Project) {
    Project.query(function (data) {
      $scope.projects = data;
      $scope.buildPager();
    });

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
  }
]);