'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$rootScope', '$timeout', '$state', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $rootScope, $timeout, $state, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // Update a user profile

		//Check to see if the person has not changed their username
    if ( ($scope.user.username.indexOf('un-verified') >= 0) ) {
      $scope.tempUsername = true;
      console.log('Temp Username = true');
    }

    /* Make sure the user can't change the view until they update both their username and password */
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
      /* Attach the temporary password to the auth service for the settings page to use and transition to the user account settings page */
      var isUnverified = ($scope.user.username.indexOf('un-verified') >= 0);
      var hasTempPassword = ($scope.user.tempPassword !== '');
      if (isUnverified || hasTempPassword) {
        $state.go('settings.profile');
      }
    });


    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        Authentication.user = response;

				console.log(response);

				//Remove the change username warning if their name no longer contains un-verified
				if ( (response.username.indexOf('un-verified') === -1) ) {
					$scope.tempUsername = false;
					console.log('Temp Username = true');
				} else {
					$scope.tempUsername = true;
				}
        $scope.profileUpdateSuccess = true;
				$scope.usernameTaken = false;
        $timeout(function () {
            $scope.profileUpdateSuccess = false;
        }, 3000);
      }, function (response) {
        $scope.profileUpdateError = response.data.message;
				$scope.usernameTaken = true;
      });
    };
  }
]);
