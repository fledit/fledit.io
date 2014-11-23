'use strict';

angular.module('fledit').controller('EmbedCtrl', function ($scope, file) {
  	$scope.file = file;
	$scope.content = JSON.stringify(file.content, null, 4);
});
