'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main', {
    url: '/',
    params: {
      'new': {
        value: null
      }
    },
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  });
});
