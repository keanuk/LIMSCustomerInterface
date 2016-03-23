'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Project', '$http', '$state',
  function ($scope, Authentication, Project, $http, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

		$scope.getUserProjects = function() {
			if ($scope.authentication) {
				$http({
		      method: 'GET',
		      url: '/api/allowedprojects'
				})
				.then(function successCallback(response) {
	        $scope.hello = response.data;
					console.log($scope.hello);
	      }, function errorCallback(response) {
	        console.log('Error in retrieving projects');
	      });

			}
		};
	}
]);
