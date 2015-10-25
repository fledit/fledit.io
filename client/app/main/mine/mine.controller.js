'use strict';

angular.module('fledit').controller('MainMineCtrl', function ($scope, filemanager, Restangular, mine, Paginator) {
  $scope.remove = function(file) {
    // Ask for confirmation
    if( confirm('This file will be lost for you and every people who are using it. Are you sure?') ) {
      // Take id and secret from state parameters
      Restangular
        .one('files', file._id)
        .remove({ secret: file.secret})
        .then(function() {
          // Remove it from "my files"
          filemanager.remove(file._id);
        });
    }
  };

  $scope.claim = function(file) {
    // Take id and secret from state parameters
    Restangular
      .one('files', file._id)
      .one('claim')
      .patch({ secret: file.secret})
      .then(function() {
        // Remove it from "my files"
        filemanager.remove(file._id);
      });
  };

  filemanager.all().then(function(myfiles) {
    $scope.mine = new Paginator(mine);
    // Add each file to the paginator object
    _.each(myfiles, function(f) { $scope.mine.objects.push(f); });
  });

});
