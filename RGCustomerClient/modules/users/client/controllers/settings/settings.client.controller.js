'use strict';

angular.module('users').controller('SettingsController', ['$scope','$timeout','$rootScope', 'Authentication',
  function ($scope, $timeout, $rootScope, Authentication) {

    $scope.user = Authentication.user;
    $scope.showPasswordPopover = false;
    $scope.showPasswordPopover = false;

    $scope.passwordPopover = {
      content: 'Please reset your password before continuing.',
      title: 'Password Reset'
    };

    $scope.userNamePopover = {
      content: 'Please reset your username before continuing.',
      title: 'Username Reset'
    };



    $scope.checkVerification = function() {
      $timeout(function () {
        if ($scope.user.username.indexOf('un-verified') >= 0) {

        }
      }, 1000);

    };

}]);
