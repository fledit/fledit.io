'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,
  // Root path of server
  root: path.normalize(__dirname + '/../../..'),
  // Server port
  port: process.env.PORT || 9000,
  // Should we populate the DB with sample data?
  seedDB: false,
  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'fledit-secret'
  },
  // Default items limit
  paginate_by: 10,
  // Maximum number of item per page
  max_paginate_by: 20,
  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  // Github OAuth
  github: {
    clientID:     process.env.GITHUB_ID || 'id',
    clientSecret: process.env.GITHUB_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/github/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all, require('./' + process.env.NODE_ENV + '.js') || {});
