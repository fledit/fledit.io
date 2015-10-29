'use strict';

var       _ = require('lodash'),
RateLimiter = require('limiter').RateLimiter;

var response = require("../response"),
   paginator = require("../paginator"),
  serializer = require('./file.serializer');

var File = require('./file.model');
// We can't allow more than 10 try to get file with secret by hour
var secretLimiter = new RateLimiter(10, 'hour');
// We can't allow more than 30 creations by hour
var createLimiter = new RateLimiter(30, 'hour');


// Get list of files
exports.index = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);

  File
    .find()
    .limit(params.limit)
    .skip(params.offset)
    .sort('-updated_at')
    .exec(function (err, files) {
      if(err) { return response.handleError(res)(err); }
      return res.json(200, serializer.collection(files, { req: req }) );
    });
};

// Search files
exports.search = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);

  if(!req.query.q || req.query.q.length < 1) {
    return response.validationError(res)({ error: 'Query parameter must not be empty.' });
  }

  File
    .find({ "name": { "$regex": req.query.q, "$options": "i" }})
    .limit(params.limit)
    .skip(params.offset)
    .sort('-updated_at')
    .exec(function (err, files) {
      if(err) { return response.handleError(res)(err); }
      return res.json(200, serializer.collection(files, { req: req }) );
    });
};

// Get a single file
exports.show = function(req, res) {
  // Gets secret
  var secret = req.query.secret;

  var callback = function (err, file) {
    // Something happend
    if(err) {
      return response.handleError(res)(err);
    // Wrong secret
    } else if(!file && secret) {
      // Notice the limiter
      secretLimiter.removeTokens(1, function() {
        return response.handleError(res)({error: "Wrong secret"});
      });
    // File not found
    } else if(!file) {
      return res.send(404);
    // Everything is OK
    } else {
      return res.json( file.toJSON({ req: req, transform: true }) );
    }
  };

  if(secret) {
    // Check tries remaing
    if( secretLimiter.getTokensRemaining() < 1 ) {
      return response.handleError(res)({error: "Reached rate limit"});
    }
    File.findOne({_id: req.params.id, secret: secret}, callback);
  } else {
    File.findById(req.params.id, callback);
  }
};

// Creates a new file in the DB.s
exports.mine = function(req, res) {
  // Build paginator parameters
  var params = paginator.offset(req);

  File
    .find({ owner: req.user._id })
    .limit(params.limit)
    .skip(params.offset)
    .sort('-updated_at')
    .exec(function (err, files) {
      if(err) { return response.handleError(res)(err); }
      return res.json(200, serializer.collection(files, { req: req }) );
    });
};

// Creates a new file in the DB.s
exports.create = function(req, res) {
  // Check creations remaing
  if( createLimiter.tryRemoveTokens(1) ) {
    // Copy raw request body
    var file = req.body;
    // Attach the current user to the file
    file.owner = req.user || null;
    // Enought tokens to create a file
    File.create(file, function(err, file) {
      if(err) { return response.handleError(res)(err); }
      return res.json(201, file.toJSON({ req: req, transform: true }) );
    });
  } else {
    return response.handleError(res)({error: "Reached rate limit"});
  }
};

// Updates an existing file in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  var params, secret = req.body.secret || req.query.secret;
  // Authentication without secret for authenticated user
  if( !secret && req.isAuthenticated() ) {
    // Find the file using user id
    params = {_id: req.params.id, owner: req.user._id};
  // Authentication using secret
  } else {
    // Check tries remaing
    if( secretLimiter.getTokensRemaining() < 1 ) {
      return response.handleError(res)({ error: "Reached rate limit" });
    }
    // Find the file using the secret
    params = {_id: req.params.id, secret: secret};
  }
  // Get the file using the secret
  File.findOne(params, function (err, file) {
    if (err) { return response.handleError(res)(err); }
    if(file === null) {
      // Notice the limiter if a secret is given
      if(secret) { secretLimiter.removeTokens(1); }
      return res.send(404);
    } else {
      // Only content and name can be changed
      file.content   = req.body.content;
      file.name      = req.body.name;
      file.validator = req.body.validator;
      // Avoid secret regeneration
      file.secret = secret;
      file.save(function (err) {
        if (err) { return response.handleError(res)(err); }
        return res.json(200, file.toJSON({ req: req, transform: true }) );
      });
    }
  });
};

// Claim the ownership over a file
exports.claim = function(req, res) {
  // Check tries remaing
  if( secretLimiter.getTokensRemaining() < 1 ) {
    return response.handleError(res)({ error: "Reached rate limit" });
  }
  var secret = req.body.secret || req.query.secret;
  // Get the file using the secret
  File.findOne({_id: req.params.id, secret: req.body.secret}, function (err, file) {
    if (err) { return response.handleError(res)(err); }
    if(file === null) {
      // Notice the limiter
      secretLimiter.removeTokens(1, function() {
        return res.send(404);
      });
    } else {
      // Avoid secret regeneration
      file.secret = secret;
      // Use the request's user
      file.owner = req.user;
      file.save(function (err) {
        if (err) { return response.handleError(res)(err); }
        return res.json(200, file);
      });
    }
  });
};

// Delete an existing file in the DB.
exports.delete = function(req, res) {
  // Check tries remaing
  if( secretLimiter.getTokensRemaining() < 1 ) {
    return response.handleError(res)({ error: "Reached rate limit" });
  }
    // Delete the file
  File.remove({_id: req.params.id, secret: req.query.secret}, function (err, removed) {
    if (err) { return response.handleError(res)(err); }
    if(removed === 0) {
      // Notice the limiter
      secretLimiter.removeTokens(1, function() {
        return res.send(404, 'No file deleted');
      });
    } else {
      return res.json(200);
    }
  });
};
