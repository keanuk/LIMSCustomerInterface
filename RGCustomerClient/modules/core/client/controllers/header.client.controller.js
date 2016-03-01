'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    var user = $scope.authentication.user;
    var original = false;
    for(var role in user.roles){
      if(role === 'admin' || role === 'user'){
        original = true;
      }
    }
    if(original === true){
      $scope.menu = Menus.getMenu('topbar');
    }
    else{
      $scope.menu = Menus.getMenu('groupleadtop');
    }

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);
