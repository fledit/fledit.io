'use strict';

angular.module('fledit').controller('MainFileCtrl', function ($scope, $document, socket, file, $stateParams, $location, localStorageService) {

  var editor = $scope.updatedFile = null
  // Save the editor instance for further update 
  // @tofix: ui-ace doesn't support changes from the scope, updating the editor
  // is a temporary solution (clue: ngModel.$render isn't called).
  $scope.saveEditor = function(session) { editor = session; }
  // Path to the api endpoint of the current file
  $scope.rawFilePath = function() {
    return document.baseURI + "api/files/" + file._id;
  };
  // This will parse the text content, add 
  // the secret key and save the file
  $scope.saveFile = function() {
    // Avoid reloading file
    $scope.updatedFile = null;
    // Allows edition
    file.secret = $scope.secret;
    // Parse text content to JSON
    file.content = angular.fromJson($scope.content) 
    // And save
    file.save();    
  };
  // Use the $scope.updatedFile to update the file object (once)
  $scope.refreshFile = function() {
    angular.extend(file, $scope.updatedFile);
    $scope.updatedFile = null;
  };
  // Use the $scope.updatedFile to update the file object (once)
  $scope.mustRefreshFile = function() {
    return $scope.updatedFile !== null && !_.isEqual($scope.updatedFile.content, file.content);
  };
  // File change only when the parsed edtior content is different than the one
  // save into the file object. Parsing error returns false.
  $scope.fileChanged = function() {
    try {
      return ! _.isEqual(angular.fromJson($scope.content), file.content);
    } catch(e) {
      return false
    }
  };

  // Unsubscribe to the file when the scope is destroyed
  $scope.$on("$destroy", function() { socket.unsubscribe(file._id) });  
  // Subscribe to 
  socket.subscribe(file._id).on("save", function(updatedFile) {    
    $scope.updatedFile = updatedFile;
  });

  // If a secret is given, we must store it and change search
  if($stateParams.secret) {
    $scope.secret = $stateParams.secret;
    // Save the secret token in local storage
    localStorageService.set($stateParams.id, $stateParams.secret);
    // Reset the search parameter
    $location.search("secret", null);
  // A secret might by given from localstorage
  } else if(localStorageService.get($stateParams.id) ) {
    $scope.secret = localStorageService.get($stateParams.id);
  }

  // Watch current file instance
  $scope.$watch(function() { return file.content; }, function() {        
    // Does the file exist?
    if(file) {
      // Stringify received JSON to allow edition
      $scope.file = file;
      $scope.content = angular.toJson(file.content, true);    
      // Does the editor already rexist?
      if(editor && editor.getValue() !== $scope.content ) { 
        editor.setValue($scope.content); 
      }
    }
  // Deep watch
  }, true);
});
