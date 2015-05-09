'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main.file.form', {
        url: '/form',
        templateUrl: 'app/main/file/form/form.html',
        controller: 'MainFileFormCtrl',
        resolve: {
          // The file that validate this file
          validator: function(file, Restangular) {
            if(file.validator) {
              return  Restangular.one("files", file.validator).get();
            } else {
              return null;
            }
          }
        }
      });
  });
