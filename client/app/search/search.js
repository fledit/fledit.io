'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/search?q',
        controller: 'SearchCtrl',
        templateUrl: 'app/search/search.html',
        resolve: {
          files: function($stateParams, Restangular) {
            return Restangular.all("files").all("search").getList($stateParams);
          }
        }
      });
  });
