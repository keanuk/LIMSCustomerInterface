'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      })
      .state('groupleader', {
        abstract: true,
        url: '/groupleader',
        template: '<ui-view>',
        data: {
          roles: ['groupleader']
        }
      });
  }
]);
