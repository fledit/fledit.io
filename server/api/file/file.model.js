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
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  },
  validator: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  }
}, {
  versionKey: "revision"
});

FileSchema.plugin(hash, {
  field: "secret",
  size: 16
});

FileSchema.pre('save', function(next){
  var now = new Date();
  // Autofill "updated_at" everytime
  this.updated_at = now;
  // Autofill "created_at" field once
  if ( !this.created_at ) { this.created_at = now; }
  next();
});

module.exports = mongoose.model('File', FileSchema);
