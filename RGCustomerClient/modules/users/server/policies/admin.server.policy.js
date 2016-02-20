'use strict';

require('../models/user.server.model.js');

/**
 * Module dependencies.
 */
var acl = require('acl');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var _ = require('lodash');

exports.validateAdmin = function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
        if (err) {
          res.status(403).send('User not found.');
        } else if (_.includes(user.roles, 'admin')) {
          console.log('Admin role validated.');
          next();
        } else {
          res.status(403).send('Permission denied.');
        }
    });
};

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/users',
      permissions: '*'
    }, {
      resources: '/api/users/:userId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
