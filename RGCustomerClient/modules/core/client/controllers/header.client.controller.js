'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    /*var user = $scope.authentication.user;
    var original = false;
    for(var i = 0; user && user.roles && i < user.roles.length; i++){
      if(user.roles[i] === 'admin' || user.roles[i] === 'user'){
        original = true;
      }
    }
    if(original === true){
      $scope.menu = Menus.getMenu('topbar');
    }
    else{
      $scope.menu = Menus.getMenu('groupleadtop');
    }*/

    //  if the correct menu changes, this will change the header accordingly 
    $scope.$watch(function () { return Menus.decideMenu(); }, 
      function () {
        if(Menus.decideMenu() === 'admin'){
          $scope.menu = Menus.getMenu('topbar');
        }
        else{
          $scope.menu = Menus.getMenu('groupleadtop');
        }
      }
    );

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
