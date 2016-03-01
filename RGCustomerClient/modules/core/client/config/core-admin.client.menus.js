'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });

    Menus.addMenuItem('groupleadtop', {
    	title: 'Group Leader',
    	state: 'groupleader',
    	type: 'dropdown',
    	roles: ['groupleader']
    });
  }
]);
