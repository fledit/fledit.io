'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('page', {
      	abstract: true,
        url: '/page',
        templateUrl: 'app/page/page.html'
      });
  });