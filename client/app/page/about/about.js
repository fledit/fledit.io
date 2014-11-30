'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('page.about', {
        url: '/about',
        templateUrl: 'app/page/about/about.html'
      });
  });