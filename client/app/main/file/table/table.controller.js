'use strict';

angular.module('fledit').controller('MainFileTableCtrl', function ($scope, file) {
  $scope.rows = file.content;
  // Received an object to edit
  $scope.$on("table-view:edit-properties", function(ev, value) {
    $scope.properties = value;
  });
});
