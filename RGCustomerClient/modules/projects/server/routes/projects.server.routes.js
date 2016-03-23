'use strict';

module.exports = function (app) {
  // User Routes
  var projects = require('../controllers/projects.server.controller');
	var plates = require('../../../plates/server/controllers/plates.server.controller');

	//For group-leader or admin adding a new user
  app.route('/api/myprojects')
    .get(projects.listProjects);

	//Retrieve the projects an individual has access to
  app.route('/api/allowedprojects')
    .get(projects.projectAccess);

	//For routes with a parameter, run this middleware for the route
  app.param('userId', projects.userByID);
};
