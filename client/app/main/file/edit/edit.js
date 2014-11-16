'use strict';

angular.module('fledit').config(function ($stateProvider) {
  $stateProvider.state('main.file.edit', {
    url: '/edit',
    templateUrl: 'app/main/file/edit/edit.html',
    controller: 'MainFileEditCtrl',
    reloadOnSearch: false
  });
});
