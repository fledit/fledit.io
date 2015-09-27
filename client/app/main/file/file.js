'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main.file', {
    url: 'file/:id?secret',
    data: {
      secret: { value: null }
    },
    templateUrl: 'app/main/file/file.html',
    controller: 'MainFileCtrl',
    resolve: {
      file: function($state, $stateParams, $q, Restangular, filemanager) {
        // Handle no found file
        var handleError = function() {
          // Reject the promise
          deferred.reject();
        };
        var deferred = $q.defer();
        // Look for the file's secret (if any)
        filemanager.secret($stateParams.id)
          .then(function(secret) {
            // Retreive the file from database
            Restangular.one('files', $stateParams.id)
              // Get the file with secret token (if any)
              .get({ secret: $stateParams.secret || secret })
              // Catch result
              .then(deferred.resolve, handleError);
          });

        // Returns a promise
        return deferred.promise;
      }
    }
  });
});
