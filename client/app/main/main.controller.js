'use strict';

angular.module('fledit').controller('MainCtrl', function ($scope, $state, $q, r, filemanager) {

  var loadFiles = function() {
    filemanager.all().then(function(files) {
      // Get all files
      $scope.myfiles = _.values(files);
    });
  };

  var dropTextFile = function(file, old) {
    // Skip unefined value
    if(file) {
      try {
        if( ! $state.is("main") ) {
          $state.go("main")
        }

        var parsedFile = angular.fromJson(file);
        $scope.newFile = JSON.stringify(parsedFile, null, 4);
      } catch (e) {
        $scope.error = "This is not a JSON file.";
      }
    }
  };


  // Submit a new search, go straight to the same state
  $scope.search = function(q) {
    $state.go('search', { q: q });
  };

  $scope.addFile = function() {

    var data = {
      content: angular.fromJson($scope.newFile)
    };

    // Turn off any existing error
    $scope.error = null;

    r.all('files').post(data).then(function(data) {
      // Success!
      if(data._id) {
        // Reset the scope value
        $scope.newFile = '';
        // Go to the file view
        $state.go("main.file.use", { id: data._id, secret: data.secret });
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

  $scope.showSidebar = false;
  // Hide the sidebar on state change
  $scope.$on("$stateChangeStart", function() {
    $scope.showSidebar = false;
  });
  $scope.$watch("fileText", dropTextFile);
  $scope.$on("filemanager:updated", loadFiles);
  loadFiles();

});
