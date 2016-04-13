'use strict';

module.exports = function (app) {
  // User Routes
  var projects = require('../controllers/projects.server.controller');
	var plates = require('../../../plates/server/controllers/plates.server.controller');

  // If admin, lists all projects, otherwise lists projects that the person can give to other group members
  app.route('/api/myprojects')
    .get(projects.listProjects);

  // If admin, lists all projects, otherwise lists projects that the person has access to
	//Retrieve the projects an individual has access to
  app.route('/api/allowedprojects')
    .get(projects.projectAccess);

  // Lists the projects that a specific group member has access to while looking at the group member's information
  app.route('/api/userprojects')
    .get(projects.otherUserProjects);
		
  app.route('/api/updatepermissions')
    .put(projects.updatePermissions);

	//For routes with a parameter, run this middleware for the route
  app.param('userId', projects.userByID);
};
