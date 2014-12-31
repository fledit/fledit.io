'use strict';

angular.module('fledit').controller('MainFileTableCtrl', function ($scope, file) {
  $scope.rows = file.content;
  // List of edidable objects
  $scope.nestedObjects = [];
  // Received an object to edit
  $scope.$on("table-view:edit-properties", function(ev, nested) {
    // Only one child by nested object
    $scope.nestedObjects = _.filter($scope.nestedObjects, function(n) {
      return n.parent !== nested.parent;
    });
    // Remove useless nested objects
    $scope.cleanNestedObjects();
    // Add the nested object to the list
    $scope.nestedObjects.push(nested);
  });
  $scope.cleanNestedObjects = function() {
    // Remove nested objects without parent
    $scope.nestedObjects = _.filter($scope.nestedObjects.concat($scope.rows), function(n) {
      return n.parent === $scope.rows || _.find($scope.nestedObjects, { properties: n.parent })
    });
  }
  // Remove properties of the list
  $scope.removeNested = function(nested) {
    if(nested) {
      var idx = $scope.nestedObjects.indexOf(nested);
      $scope.nestedObjects.splice(idx, 1);
      // Remove useless nested objects
      $scope.cleanNestedObjects();
    } else {
      $scope.nestedObjects = [];
    }
  };
});
