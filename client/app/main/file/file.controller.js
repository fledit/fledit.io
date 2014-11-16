'use strict';

angular.module('fledit').controller('MainFileCtrl', function ($scope, $document, file, $stateParams, $location, localStorageService) {

  $scope.rawFilePath = function() {
    return document.baseURI + "api/files/" + file._id;
  };

  // Stringify received JSON to allow edition
  file.content = angular.toJson(file.content, true);
  $scope.file = file;
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
});
