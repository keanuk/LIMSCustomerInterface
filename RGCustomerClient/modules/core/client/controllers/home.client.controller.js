'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Project', '$http', '$state',
  function ($scope, Authentication, Project, $http, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    
    $http({
      method: 'GET',
      url: '/api/allowedprojects'
    }).then(function successCallback(response) {
        $scope.hello = response.data;
      }, function errorCallback(response) {
        console.log('Error in retrieving projects');
      });
  }
]);
