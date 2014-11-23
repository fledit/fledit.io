'use strict';

angular.module('fledit').controller('MainCtrl', function ($scope, $state, Restangular, filemanager) {
  
  $scope.addFile = function() {
    
    var data = { 
      content: angular.fromJson($scope.newFile) 
    };
    
    // Turn off any existing error
    $scope.error = null;

    Restangular.all('files').post(data).then(function(data) {
      // Success!
      if(data._id) {
        // Reset the scope value
        $scope.newFile = '';
        // Go to the file view
        $state.go("main.file", { id: data._id, secret: data.secret });
      }
    // Something's wrong
    }, function(res) {
      // Simply update the scope
      $scope.error = res.data.error;
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
