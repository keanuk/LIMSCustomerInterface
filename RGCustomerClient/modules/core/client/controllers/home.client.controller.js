'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Project', '$http', '$state',
  function ($scope, Authentication, Project, $http, $state) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    Project.query(function (data) {
    	$scope.hello = data;
    });
  }
]);
