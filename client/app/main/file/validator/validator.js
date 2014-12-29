'use strict';

angular.module('fledit').config(function ($stateProvider) {
    $stateProvider.state('main.file.validator', {
        url: '/validator',
        onEnter: function($stateParams, $state, $modal, file) {
            // Function to go back to the parent state
            var goBack = function() { $state.go("main.file"); }
            // Create a modal
            $modal.open({
              templateUrl: 'app/main/file/validator/validator.html',
                controller: 'MainFileValidatorCtrl',
                resolve: {
                    // Just pass the parent file object
                    file: function() { return file; },
                    // Get the secret token to edit this file
                    secret: function(filemanager) {
                      return filemanager.secret($stateParams.id)
                    },
                    // The file that validate this file
                    validator: function(Restangular) {
                      if(file.validator) {
                        return  Restangular.one("files", file.validator).get();
                      } else {
                        return null;
                      }
                    }
                }
            }).result.then(goBack, goBack);
        }
    });
});
