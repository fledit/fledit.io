'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main.file', {
    url: 'file/:id?secret',
    data: {
      secret: { value: null }
    },
    templateUrl: 'app/main/file/file.html',
    controller: 'MainFileCtrl',
    resolve: {
      file: function($stateParams, Restangular) {
        var params = {
          // Take secret from parameter
          secret: $stateParams.secret
        };
        return Restangular.one("files", $stateParams.id).get(params);
      }
    }
  });
});
