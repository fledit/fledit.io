'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main', {
    url: '/',
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  });
});
