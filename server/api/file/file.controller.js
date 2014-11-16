'use strict';

var _ = require('lodash');
var File = require('./file.model');

// Get list of files
exports.index = function(req, res) {
  File.find(function (err, files) {
    if(err) { return handleError(res, err); }
    return res.json(200, files);
  });
};

// Get a single file
exports.show = function(req, res) {

  var callback = function (err, file) {
    if(err) { return handleError(res, err); }
    if(!file) { return res.send(404); }
    return res.json(file);
  };

  var secret = req.query.secret;

  if(secret) {
    File.findOne({_id: req.params.id, secret: secret}, callback);
  } else {
    File.findById(req.params.id, callback);
  }
};

// Creates a new file in the DB.
exports.create = function(req, res) {
  File.create(req.body, function(err, file) {
    if(err) { return handleError(res, err); }
    return res.json(201, file);
  });
};

// Updates an existing file in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  File.findById(req.params.id, function (err, file) {
    if (err) { return handleError(res, err); }
    if(!file) { return res.send(404); }
    var updated = _.merge(file, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, file);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
