'use strict';

angular.module('fledit').controller('ValidatorCtrl', function ($scope, $state, $urlMatcherFactory, Restangular, validator, file, secret) {

  if(validator !== null) {
    $scope.validator = $state.href("main.file", { id: validator._id }, { absolute: true });
  }

  var urlParams = function(url) {
    url = url || "";
    // Not a valid url
    if( url.indexOf('#/') === -1 ) return null;
    // Get the path from the url
    var path = url.split('#/')[1];
    // Create a url matcher and extract the params
    return $urlMatcherFactory.compile("file/{id:[^/]*}").exec(path)
  };

  $scope.validUrl = function(url) {
    var params = urlParams(url);
    return ['', null, undefined].indexOf(url) > -1 || params !== null && params.id;
  };

  $scope.submitValidator = function() {
    // Get url params
    var params = urlParams($scope.validator);
    // Id of the file
    var id = params === null ? null : params.id;
    // File itself
    Restangular.one("files", id).get().then(function(v) {
      // This validator exists. Update the current file.
      file.validator = v._id;
      // Add the secret
      file.secret = secret
      // And save it
      file.save().then(function() {
        validator = v;
      });
    })
  };
});
