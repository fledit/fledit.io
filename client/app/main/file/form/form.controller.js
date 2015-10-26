'use strict';

angular.module('fledit')
  .controller('MainFileFormCtrl', function ($scope, file, validator) {
    var extendArrayField = function(obj) {
      // Recurcive call for nested values
      _.each(obj, function(val, name) {
        // Only for value that are objects too
        if(val instanceof Object) {
          obj[name] = extendArrayField(val);
        }
      });
      // Extend array field without items
      if(obj.type && obj.type === 'array') {
        // An array field must always define an items attributes
        if(!obj.items) {
          // We assume that a list of item is by default
          // a list of strings.
          obj.items = { type: 'string' };
        }
        // We may add a name for this field
        if(!obj.items.title) {
          if(obj.title) {
            obj.items.title = obj.title + ' item';
          } else {
            obj.items.title = 'item';
          }
        }
      }
      return obj;
    };

    $scope.form = ['*'];
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
    // Extend some vvalidator fields to obtain a more error-proof form
    $scope.validator = extendArrayField(validatorContent);
    $scope.file = file;
    // The form will edit a copy of the file object
    $scope.fileBuffer = {'neasted': file.content };
  });
