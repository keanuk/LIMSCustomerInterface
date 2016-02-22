'use strict';

/**
 * Module dependencies.
 */

var passport = require('passport');

module.exports = function (app) {
  var adminPolicy = require('../policies/admin.server.policy'),
      admin = require('../controllers/admin.server.controller'),
      users = require('../controllers/users.server.controller');

  // User route registration first. Ref: #713
  require('./users.server.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  app.route('/api/user/new')
    .post(adminPolicy.validateAdmin, users.adminSignup);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  app.route('/api/projects')
    .get(admin.listProjects);

  app.route('api/projects/projectId')
    .get(admin.readProject);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
