'use strict';

angular.module('fledit').config(function ($stateProvider) {
    $stateProvider.state('main.file.use.duplicate', {
        url: '/duplicate',
        onEnter: function($stateParams, $state, $modal, file) {  
            // Function to go back to the parent state
            var goBack = function() { $state.go("main.file.use"); }          
            // Create a modal
            $modal.open({
                templateUrl: 'app/main/file/use/duplicate/duplicate.html',
                controller: 'MainFileUseDuplicateCtrl',
                resolve: {
                    // Just pass the parent file object
                    file: function() { return file; }
                }
            }).result.then(goBack, goBack);
        }    
    });
});