'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('page.tos', {
        url: '/tos',
        templateUrl: 'app/page/tos/tos.html'
      });
  });