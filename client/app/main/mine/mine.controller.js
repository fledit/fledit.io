'use strict';

angular.module('fledit').controller('MainMineCtrl', function ($scope, filemanager, Restangular) {
  $scope.remove = function(file) {
    // Ask for confirmation
    if( confirm("This file will be lost for you and every people who are using it. Are you sure?") ) {
      // Take id and secret from state parameters
      Restangular.one("files", file._id).remove({ secret: file.secret });
      // Remove it from "my files"
      filemanager.remove(file._id);
    }
  }
});
