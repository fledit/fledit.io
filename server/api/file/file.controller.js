'use strict';

var _ = require('lodash');
var File = require('./file.model');
var RateLimiter = require('limiter').RateLimiter;
// We can't allow more than 10 try to get file with secret by hour
var secretLimiter = new RateLimiter(10, 'hour');
// We can't allow more than 40 creations by hour
var createLimiter = new RateLimiter(40, 'hour');


function handleError(res, err) {
  return res.send(500, err);
}


// Get list of files
exports.index = function(req, res) {
  File.find(function (err, files) {
    if(err) { return handleError(res, err); }
    return res.json(200, files);
  });
};

// Get a single file
exports.show = function(req, res) {
  // Gets secret
  var secret = req.query.secret;

  var callback = function (err, file) {
    // Something happend
    if(err) { 
      return handleError(res, err);
    // Wrong secret 
    } else if(!file && secret) { 
      // Notice the limiter
      secretLimiter.removeTokens(1, function() {     
        return handleError(res, {error: "Wrong secret"});
      });
    // File not found
    } else if(!file) {       
      return res.send(404);
    // Everything is OK
    } else {
      return res.json(file);
    }
  };

  if(secret) {
    // Check tries remaing
    if( secretLimiter.getTokensRemaining() < 1 ) {
      return handleError(res, {error: "Reached rate limit"});
    }
    File.findOne({_id: req.params.id, secret: secret}, callback);
  } else {
    File.findById(req.params.id, callback);
  }
};

// Creates a new file in the DB.
exports.create = function(req, res) {
  // Check creations remaing
  if( createLimiter.tryRemoveTokens(1) ) {
    // Enought tokens to create a file
    File.create(req.body, function(err, file) {
      if(err) { return handleError(res, err); }
      return res.json(201, file);
    });
  } else {
    return handleError(res, {error: "Reached rate limit"});
  }
};

// Updates an existing file in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  // Check tries remaing
  if( secretLimiter.getTokensRemaining() < 1 ) {
    return handleError(res, { error: "Reached rate limit" });
  }
  File.findOne({_id: req.params.id, secret: req.body.secret}, function (err, file) {
    if (err) { return handleError(res, err); }
    if(!file) { 
      // Notice the limiter
      secretLimiter.removeTokens(1, function() {     
        return res.send(404); 
      });
    }
    // Only content and name can be changed    
    file.content = req.body.content;
    file.name    = req.body.name;
    // Avoid secret regeneration    
    file.secret = req.body.secret;    
    file.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, file);
    });
  });
};