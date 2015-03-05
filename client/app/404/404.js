'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('404', {
        templateUrl: 'app/404/404.html'
      });
  });
