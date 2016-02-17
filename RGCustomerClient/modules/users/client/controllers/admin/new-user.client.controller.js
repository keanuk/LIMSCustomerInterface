'use strict';

angular.module('users.admin').controller('NewUserCtrl', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
    });


  }
]);
