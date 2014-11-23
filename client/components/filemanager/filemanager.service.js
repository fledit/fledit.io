/* global io */
'use strict';

angular.module('fledit').factory('filemanager', function(localStorageService) {
  return {
    all: function() {
      return localStorageService.get("files") || {};
    },
    get: function(id) {
      return this.all()[id];
    },
    save: function(file) {
      // Get all files
      var all = this.all();
      // Avoid losing secret when updating a local copy
      if(!file.secret || all[file._id]) {
        file.secret = all[file._id].secret || file.secret;
      }
      // Add (or update) this one
      all[file._id] = _.pick(file, ['_id', 'name', 'secret', 'updated_at']);
      // And add the new files list to local storage
      localStorageService.set("files", all);
      // We return the service for chaining
      return this;
    },
    secret: function(id) {
      return ( this.get(id) || {} ).secret;
    },
    allowed: function(id) {
      return !! this.secret(id);
    }       
  };
});
