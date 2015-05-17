'use strict';

angular.module('fledit')
  .controller('MainFileFormCtrl', function ($scope, file, validator) {
    $scope.form = ["*"];
    // We may edit the validator
    var validatorContent = angular.copy(validator.content);
    // Hide the title
    validatorContent.title = validatorContent.title ||  validator.name || file.name || 'Untitled';
    // Ensure that the root item of the validator is an Object
    validatorContent = {
      type: 'object',
      title: false,
      properties: {
        'neasted': validatorContent
      }
    };

    $scope.validator = validatorContent;
    $scope.file = file;
    // The form will edit a copy of the file object
    $scope.fileBuffer = {'neasted': file.content };
  });
