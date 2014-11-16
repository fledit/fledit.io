'use strict';

angular.module('fledit').config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});
