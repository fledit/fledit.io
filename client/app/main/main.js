'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main', {
    url: '/?new',
    templateUrl: 'app/main/main.html',
    controller: 'MainCtrl'
  });
});
