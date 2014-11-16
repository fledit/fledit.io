'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main.file', {
    url: ':id',
    templateUrl: 'app/main/file/file.html',
    controller: 'MainFileCtrl',
    resolve: {
      file: function($stateParams, Restangular) {
        return Restangular.one("files", $stateParams.id).get();
      }
    }
  });
});
