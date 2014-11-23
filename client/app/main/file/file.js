'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main.file', {
    url: ':id?secret',
    data: {
      secret: { value: null }
    },
    templateUrl: 'app/main/file/file.html',
    controller: 'MainFileCtrl',
    resolve: {
      file: function($stateParams, Restangular, localStorageService) {
        var params = {
          // Take secret from parameter OR localstorage
          secret: $stateParams.secret || localStorageService.get($stateParams.id)
        };
        return Restangular.one("files", $stateParams.id).get(params);
      }
    }
  });
});
