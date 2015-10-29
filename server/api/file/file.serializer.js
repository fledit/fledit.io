'use strict';

var _ = require("lodash");

module.exports = function(File) {
  if (!File.schema.options.toJSON) File.schema.options.toJSON = {};
  // Return the serializer
  return File.schema.options.toJSON.transform = function(doc, rt, options) {
    var isOwner = false, req = options.req || { body: null, query: null};
    // A secret might be given within the request
    var secret = req.body.secret || req.query.secret;
    // Cast owner and user to string in order to compare then correctly
    isOwner = req.user && "" + rt.owner === "" + req.user._id;
    // Alway use the given secret as secret
    rt.secret = isOwner ? rt.secret : secret;
  };
}


module.exports.collection = function(files, options) {
  return _.map(files, function(file) {
    // To force transformation
    options.transform = true;
    return file.toJSON(options);
  });
}
