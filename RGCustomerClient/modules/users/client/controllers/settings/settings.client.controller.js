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



    $scope.checkVerification = function() {
      $timeout(function () {
        if ($scope.user.username.indexOf('un-verified') >= 0) {

        }
      }, 1000);

    };

}]);
