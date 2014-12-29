'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.file.table', {
        url: '/table',
        templateUrl: 'app/main/file/table/table.html',
        controller: 'MainFileTableCtrl'
      });
  });
