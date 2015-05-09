'use strict';

angular.module('fledit')
  .controller('MainFileFormCtrl', function ($scope, file, validator) {
    $scope.form = ["*"];
    $scope.validator = validator;
    $scope.file = file;
  });
