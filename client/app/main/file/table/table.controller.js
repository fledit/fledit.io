'use strict';

angular.module('fledit').controller('MainFileTableCtrl', function ($scope, file) {
  $scope.rows = file.content;
  // List of edidable objects
  $scope.nestedObjects = [];
  // Received an object to edit
  $scope.$on("table-view:edit-properties", function(ev, nested) {
    $scope.nestedObjects = [ nested ]
  });
  // Remove properties of the list
  $scope.removeNested = function(nested) {
    var idx = $scope.nestedObjects.indexOf(nested);
    $scope.nestedObjects.splice(idx, 1);
  };
});
