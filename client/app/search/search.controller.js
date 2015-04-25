'use strict';

angular.module('fledit')
  .controller('SearchCtrl', function ($scope, $state, files, Paginator) {
    $scope.search = new Paginator(files);
    $scope.search.next();
  });
