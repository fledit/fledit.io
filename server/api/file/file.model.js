'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FileSchema = new Schema({
  name: String,
  secret: String,
  active: Boolean,
  content: String
});

module.exports = mongoose.model('File', FileSchema);
