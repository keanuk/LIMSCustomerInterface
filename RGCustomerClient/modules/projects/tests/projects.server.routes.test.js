/* 

'use strict';

var should = require('should'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  User = require('../../users/server/models/user.server.model.js'),
  Project = require('../server/models/projects.server.model.js'),
  Plate = require('../../plates/models/plates.server.model.js'),
  Sample = require('../../samples/server/models/samples.server.model.js'),
  config = require('../../../config/env/local.js'),
  express = require('../../../config/lib/express');


var app, agent, credentialsAdmin, credentialsGL, credentialsUser;


describe('Project Retrieval Tests', function () {

  this.timeout(20000);

  before(function (done) {
    
    app = express.init(mongoose.connect(config.db.uri));
    agent = request.agent(app);

    credentialsAdmin = {
      username: 'rtocco',
      password: '(Qwertyuiop123'
    };

    credentialsGL = {
      username: 'testgroup',
      password: '(Qwertyuiop123'
    };

    credentialsUser = {
      username: 'subtest',
      password: '(Qwertyuiop123'
    };

    done();
  });

  it('Admin should be able to retrieve all of the projects for edit user page', function(done) {
    agent.post('/api/auth/signin')
      .send(credentialsAdmin)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);

        agent.get('/api/myprojects')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.length.should.equal(50);
            done();
          });
      });

  });

  it('Admin should be able to retrieve all of the projects for the home page', function(done) {
    agent.post('/api/auth/signin')
      .send(credentialsAdmin)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err)

        agent.get('/api/allowedprojects')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.length.should.equal(50);
            done();
          });
      });
  });

  it('Admin should be able to retrieve the projects that a specific user has access to', function(done) {
    agent.post('/api/auth/signin')
      .send(credentialsAdmin)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err)

        agent.get('/api/userprojects?userId=' + '570dd365ff17e1ac7c805006')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.length.should.equal(3);
            done();
          });
      });
  });

  it('Should send 404 error instead of retrieving projects for a user if unused user id is specified', function(done) {
    agent.post('/api/auth/signin')
      .send(credentialsAdmin)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err)

        agent.get('/api/userprojects?userId=' + '570d829a47f92cac757jr874')
          .expect(404)
          .end(function(err, res) {
            should.not.exist(err)
            done();
          })
      });
  });

  it('Group Leader should be able to retrieve all of the projects that he has group leader access to', function(done) {
    agent.post('/api/auth/signin')
      .send(credentialsGL)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);

        agent.get('/api/myprojects')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.length.should.equal(3);
            done();
          });
      });
  });

  it('Group Leader should be able to retrieve all of the projects that he has any access to', function(done) {
    agent.post('/api/auth/signin')
      .send(credentialsGL)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);

        agent.get('/api/allowedprojects')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.length.should.equal(3);
            done();
          });
      });
  });

  it('Group Leader should be able to access the projects that a specific user has access to', function(done) {
    agent.post('/api/auth/signin')
      .send(credentialsGL)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err)

        agent.get('/api/userprojects?userId=' + '570dd3d5ff17e1ac7c805007')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.length.should.equal(2);
            done();
          });
      });
  });

  it('User should not have group leader access to projects', function(done) {
    agent.post('/api/auth/signin')
      .send(credentialsUser)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err);

        agent.get('/api/myprojects')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.length.should.equal(0);
            done();
          });
      });
  });

  it('User should be able to access projects for the home page', function(done) {
    agent.post('/api/auth/signin')
      .send(credentialsUser)
      .expect(200)
      .end(function(err, res) {
        should.not.exist(err)

        agent.get('/api/allowedprojects')
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);
            res.body.length.should.equal(2);
            done();
          });
      });
  });

});

*/ 