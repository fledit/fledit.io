/* global io */
'use strict';

angular.module('fledit').factory('filemanager', function($q, $rootScope) {
  var store = new Lawnchair(angular.noop);
  return {
    all: function() {
      var deferred = $q.defer();
      store.get("files", function(all) {
        if(all) {
          deferred.resolve(all.files || {});
        } else {
          deferred.resolve({});
        }
      });
      return deferred.promise;
    },
    get: function(id) {
      var deferred = $q.defer();
      this.all().then(function(files) {
        deferred.resolve(files[id]);
      });
      return deferred.promise;
    },
    save: function(file) {
      // Get all files
      return this.all().then(function(files) {
        // Avoid losing secret when updating a local copy
        if(!file.secret || files[file._id]) {
          file.secret = files[file._id].secret || file.secret;
        }
        // Add (or update) this one
        files[file._id] = _.pick(file, ['_id', 'name', 'secret', 'updated_at']);
        // And add the new files list to local storage
        store.save({key: "files", files: files });
        // Broadcast changes
        $rootScope.$broadcast("filemanager:updated", files);
      });
    },
    remove: function(id) {
      // Get all files
      return this.all().then(function(files) {
        // Remove the current id from the file
        delete files[id]
        // And add the new files list to local storage
        store.save({key: "files", files: files });
        // Broadcast changes
        $rootScope.$broadcast("filemanager:updated", files);
      });
    },
    secret: function(id) {
      var deferred = $q.defer();
      this.get(id).then(function(file) {
        deferred.resolve(file ? file.secret : undefined);
      });
      return deferred.promise;
    },
    allowed: function(id) {
      return !! this.secret(id);
    }
  };
});
