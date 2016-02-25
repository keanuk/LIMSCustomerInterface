'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$timeout',
  function($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $timeout) {
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

    $scope.initSignIn = function() {
      var params = $location.search();
      if (params.pass && params.user) {
        $timeout(function() {
          console.log(params);
          console.log(params.pass);
          console.log(params.user);
          $scope.credentials.password = params.pass;
          $scope.credentials.username = params.user;
          $scope.signin(null, true);
        }, 100);
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
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
