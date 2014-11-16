'use strict';

angular.module('fledit').controller('MainFileCtrl', function ($scope, $document, file) {
  $scope.rawFilePath = function() {
    return document.baseURI + "api/files/" + file._id;
  };
  $scope.file = file;
});
