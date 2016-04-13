'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
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
  }
]);
