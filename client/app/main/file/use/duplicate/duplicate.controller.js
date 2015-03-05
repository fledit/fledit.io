'use strict';

angular.module('fledit').controller('MainFileUseDuplicateCtrl', function ($scope, $state, file, Restangular) {
  $scope.name    = 'Copy of "' + file.name + '"';
  $scope.content = JSON.stringify(file.content, null, 4);

    $scope.addFile = function() {

      var data = {
        content: angular.fromJson($scope.content),
        name: $scope.name
      };

      Restangular.all('files').post(data).then(function(data) {
          // Success!
          if(data._id) {
            // Reset the scope value
            $scope.newFile = '';
            // Go to the file view
            $state.go("main.file", { id: data._id, secret: data.secret });
          }
      });

      $scope.$close(true);
    };

  $scope.noParseError = function($value) {
      try {
      angular.fromJson($value);
      return true;
      } catch(e) {
        return false;
      }
    };

});
