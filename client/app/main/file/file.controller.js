'use strict';

angular.module('fledit').controller('MainFileCtrl', function ($scope, $document, socket, file, $stateParams, $location, localStorageService) {

  $scope.rawFilePath = function() {
    return document.baseURI + "api/files/" + file._id;
  };


  // Unsubscribe to the file when the scope is destroyed
  $scope.$on("$destroy", function() { socket.unsubscribe(file._id) });  
  // Subscribe to 
  socket.subscribe(file._id).on("save:" + file._id, function(updatedFile) {    
    angular.extend(file, updatedFile);    
  });

  // If a secret is given, we must store it and change search
  if($stateParams.secret) {
    $scope.secret = $stateParams.secret;
    // Save the secret token in local storage
    localStorageService.set($stateParams.id, $stateParams.secret);
    // Reset the search parameter
    $location.search("secret", null);
  // A secret might by given from localstorage
  } else if( localStorageService.get($stateParams.id) ) {
    $scope.secret = localStorageService.get($stateParams.id);
  }

  $scope.$watch( function() { return file}, function() {    
    if(file) {
      // Stringify received JSON to allow edition
      $scope.file = file;
      $scope.content = angular.toJson(file.content, true);      
    }
  }, true);

  $scope.saveFile = function() {
    file.secret  = $scope.secret;
    file.content = angular.fromJson($scope.content) 
    file.save();
  };

  $scope.fileChanged = function() {
    try {
      return ! _.isEqual(angular.fromJson($scope.content), file.content);
    } catch(e) {
      return false
    }
  };
});
