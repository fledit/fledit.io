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
      file: function($state, $stateParams, $q, Restangular) {
        // Handle no found file
        var handleError = function() {
          // Reject the promise
          deferred.reject();
        };
        var deferred = $q.defer();
        // Take id and secret from state parameters
        Restangular.one("files", $stateParams.id)
          // Get the file
          .get({ secret: $stateParams.secret })
          // Catch result
          .then(deferred.resolve, handleError);
        // Returns a promise
        return deferred.promise
      }
    }
  });
});
