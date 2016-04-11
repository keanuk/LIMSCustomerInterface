'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$rootScope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$timeout',
  function($scope, $rootScope, $state, $http, $location, $window, Authentication, PasswordValidator, $timeout) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = 'Please enter a passphrase with at least 12 characters and two of the following:\n Numbers, lowercase, upppercase, or special characters.';

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    $scope.signup = function(isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function(response) {
        $scope.error = response.message;
      });
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

    $scope.initSignIn = function() {
      var params = $location.search();

      /* Retreive the temp user log in info using userId */
      if (params.userId) {
        $scope.userId = params.userId;
        console.log('Received userId: ' + $scope.userId);
        var httpGetConfig = {
          url: 'api/auth/tempUserInfo',
          method: 'GET',
          params: {userId: $scope.userId}
        };
        $http(httpGetConfig)
          .success(function(response) {
            $scope.credentials = {};
            $scope.credentials.password = response.tempPassword;
            $scope.credentials.username = response.username;
            $scope.signin(null, true);
          })
          .error(function(err) {
            console.log('Failed to retreive temp user:\n' + err);
          });
      } else {
        console.log('No params');
        return;
      }

    };

    $scope.signin = function(isValid, skipValidation) {
      $scope.error = null;

      if (!isValid && !skipValidation) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function(response) {

        /* If successful assign the response to the global user model */
        $scope.authentication.user = response;


        if (skipValidation) {
          $state.go('settings.profile');
          return;
        }

        /* And redirect to the previous or home page */
        $state.go('home', $state.previous.params);
        $window.location.reload();

      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    /* OAuth provider request */
    $scope.callOauthProvider = function(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      /* Effectively call OAuth authentication route: */
      $window.location.href = url;
    };
  }
]);
