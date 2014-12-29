'use strict';

angular.module('fledit').controller('MainFileValidatorCtrl', function ($scope, $state, $urlMatcherFactory, $modalInstance, Restangular, validator, file, secret) {

  $scope.file = file;
  $scope.secret = secret;
  $scope.validator = validator;
  $scope.close = $modalInstance.close;

  if(validator !== null) {
    $scope.validatorUrl = $state.href("main.file", { id: validator._id }, { absolute: true });
  }

  var urlParams = function(url) {
    url = url || "";
    // Not a valid url
    if( url.indexOf('#') === -1 ) return null;
    // Get the path from the url
    var path = url.split('#')[1],
    // Parameters to return
      params = null;
    // Test the path with every state
    angular.forEach($state.get(), function(state) {
      if( typeof(state.$$state) === 'function' ) {
        var privatePortion = state.$$state();
        var match = privatePortion.url.exec(path);
        // Has match and state'name starts with 'main.file'
        if (match && state.name.indexOf('main.file') === 0 ) {
          params = match;
        }
      }
    });
    // Create a url matcher and extract the params
    return params
  };


  $scope.validUrl = function(url) {
    var params = urlParams(url);
    return ['', null, undefined].indexOf(url) > -1 || params !== null && params.id;
  };

  $scope.submitValidator = function() {
    console.log($scope.validatorUrl);
    // Get url params
    var params = urlParams($scope.validatorUrl);
    // Id of the file
    var id = params === null ? null : params.id;
    // File itself
    Restangular.one("files", id).get().then(function(v) {
      // This validator exists. Update the current file.
      file.validator = v._id;
      // Add the secret
      file.secret = secret
      // And save it
      file.save().then(function(f) {
        $scope.validator = validator = v;
        $scope.file = file = f;
      });
    })
  };
});
