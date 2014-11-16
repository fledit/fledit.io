'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main.view', {
    url: ':id',
    templateUrl: 'app/view/view.html',
    controller: 'ViewCtrl',
    resolve: {
      file: function($stateParams, Restangular) {
        return Restangular.one("files", $stateParams.id).get();
      }
    }
  });
});
