'use strict';

angular.module('fledit').config(function ($stateProvider) {
    $stateProvider.state('embed', {
        url: '/embed/:id',
        templateUrl: 'app/embed/embed.html',
        controller: 'EmbedCtrl',
        resolve: {
            file: function($stateParams, Restangular, localStorageService) {
                return Restangular.one("files", $stateParams.id).get();
            }
        }
    });
});