'use strict';

var mongoose = require('mongoose'),
        hash = require('mongoose-hash'),
         tv4 = require('tv4'),
           _ = require('lodash'),
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
  },
  valid: {
    type: Boolean,
    default: null
  },
  error: {
    type: Object
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
  // A validator is given
  if ( this.validator ) {
    var file = this;
    File.findById(this.validator, function(err, validator) {
      if(err || validator === null) {
        file.error = file.valid = null;
        next();
      } else {
        file.valid = tv4.validate(file.content, validator.content);
        // Pick specific error's attributes
        file.error = _.pick(tv4.error, [
          'name', 'schemaPath', 'dataPath', 'code', 'message', 'params'
        ]);
        next();
      }
    });
  // Do not wait to send the callback
  } else {
    this.error = this.valid = null;
    next();
  }
});

var File = module.exports = mongoose.model('File', FileSchema);
