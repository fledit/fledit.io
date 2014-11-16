'use strict';

angular.module('fledit').controller('MainCtrl', function ($scope, $state, Restangular) {

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

});
