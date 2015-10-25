'use strict';

// A deduplicator for database objects
angular.module('fledit')
  .filter('deduplicator', function() {
    return function(files) {
      return _.uniq(files, function(file) {
        return file._id;
      });
    };
  });
