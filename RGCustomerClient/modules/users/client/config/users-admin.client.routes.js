'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('new-user', {
        url: '/users/new',
        templateUrl: 'modules/users/client/views/admin/new-user.client.view.html',
        controller: 'NewUserCtrl'
        /*resolve: {
          userResolve: ['$stateParams', 'Admin', function($stateParams, Admin){
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }*/
      })
      .state('groupleader.group', {
        url: '/group',
        templateUrl: 'modules/users/client/views/groupleader/list-group.client.view.html',
        controller: 'UserListController'
      })
      .state('groupleader.member', {
        url: '/group/:userId',
        templateUrl: 'modules/users/client/views/groupleader/view-member.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('groupleader.member-edit', {
        url: '/group/:userId/edit',
        templateUrl: 'modules/users/client/views/groupleader/edit-member.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        }
      })
      .state('new-member', {
        url: '/group/new',
        templateUrl: 'modules/users/client/views/groupleader/new-member.client.view.html',
        controller: 'NewMemberCtrl'
      });
  }
]);
