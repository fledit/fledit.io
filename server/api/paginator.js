'use strict';

var config = require('../config/environment');

module.exports.offset = function(req) {
  return {
    offset: Math.max(0,  req.query.offset || 0),
    limit:  Math.min(config.paginate_by, req.query.limit  || config.max_paginate_by)
  };
};

module.exports.page = function(req) {
  var limit = Math.min(config.max_paginate_by, req.query.limit  || config.paginate_by);
  return {
    page:   Math.max(1,  (req.query.offset/limit) + 1 || 1),
    limit:  limit
  };
};

