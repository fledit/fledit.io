'use strict';

angular.module('fledit').controller('MainCtrl', function ($scope, $state, Restangular, filemanager) {

  $scope.addFile = function() {
    Restangular.all('files').post({ content: angular.fromJson($scope.newFile) }).then(function(data) {
      // Success!
      if(data._id) {
        // Reset the scope value
        $scope.newFile = '';
        // Go to the file view
        $state.go("main.file", { id: data._id, secret: data.secret });
      }
    });
  };

  $scope.noParseError = function($value) {
    try {
      angular.fromJson($value);
      return true;
    } catch(e) {
      return false;
    }
  };

  // Watch the filemanager changes
  $scope.$watch( function() { return filemanager.all(); }, function(all) {
    // Get all files
    $scope.myfiles = _.values(all); 
  // Watch for content changes
  }, true);

});
