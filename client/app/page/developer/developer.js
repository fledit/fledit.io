'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('page.developer', {
        url: '/developer',
        templateUrl: 'app/page/developer/developer.html'
      });
  });