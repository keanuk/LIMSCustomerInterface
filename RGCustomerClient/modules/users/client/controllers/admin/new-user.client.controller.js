'use strict';

angular.module('projects.admin').controller('NewUserCtrl', ['$scope', '$filter', 'Project',
  function ($scope, $filter, Project) {
    Project.query(function (data) {
      //$scope.projects = data;
      //$scope.buildPager();
      $scope.nonSelected = data;
    });

    $scope.nonSelected = [];
    $scope.isSelected = [];

    $scope.moveProject = function(project, table) {
      //$scope.selectedProject = project;
      //$scope.selectedTable = table;
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