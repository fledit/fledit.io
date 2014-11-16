'use strict';

var mongoose = require('mongoose'),
        hash = require('mongoose-hash'),
      Schema = mongoose.Schema;

var FileSchema = new Schema({
  name: {
    type: String
  },
  secret: {
    type: String,
    select: false,
    require: true
  },
  active: {
    type: Boolean,
    default: true,
    require: true
  },
  content: {
    type: Object,
    require: true
  },
});

FileSchema.plugin(hash, {
  field: "secret",
  size: 16
});

module.exports = mongoose.model('File', FileSchema);
