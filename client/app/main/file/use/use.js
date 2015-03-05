'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main.file.use', {
    url: '/use',
    templateUrl: 'app/main/file/use/use.html',
    controller: 'MainFileUseCtrl'
  });
});
