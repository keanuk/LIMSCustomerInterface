'use strict';

module.exports = function (app) {
  // User Routes
  var users = require('../controllers/projects.server.controller');

  // If admin, lists all projects, otherwise lists projects that the person can give to other group members
  app.route('/api/myprojects')
    .get(users.listProjects);
  // If admin, lists all projects, otherwise lists projects that the person has access to
  app.route('/api/allowedprojects')
    .get(users.projectAccess);
  // Lists the projects that a specific group member has access to while looking at the group member's information
  app.route('/api/userprojects')
    .get(users.otherUserProjects);
  app.route('/api/updatepermissions')
    .put(users.updatePermissions);



  // Setting up the users profile api
  /*app.route('/api/users/me').get(users.me);
  app.route('/api/users').put(users.update);
  app.route('/api/users/accounts').delete(users.removeOAuthProvider);
  app.route('/api/users/password').post(users.changePassword);
  app.route('/api/users/picture').post(users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);*/
  app.param('userId', users.userByID);
};
