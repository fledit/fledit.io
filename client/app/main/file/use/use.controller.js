'use strict';

angular.module('fledit').controller('MainFileUseCtrl', function ($scope, $http, $location, file) {

	$scope.setInfiniteLines = function(editor) {
		editor.setOptions({
		    maxLines: Infinity
		});
	}

	$scope.jquery = [
		"// Simply use the raw file from the API",
		"var file ='" + $scope.rawFilePath() + "';",
		"// And get the data without unsing JSONP callback",
		"$.getJSON(file, function(data) {",
		"    console.log(data);",
		"});"
	].join("\n")

	$scope.socket = [
		"// Create a socket ",
		"var socket = io('ws://" + $location.host() + "', {path: '/socket.io-client'});",
		"// Subscribe to this file",
		"socket.emit('subscribe', '" + file._id +"');",
		"// You'll now receive all updates",
		"socket.on('save', function(file) {",
		"    console.log(file);",
		"});",
	].join("\n")

	$scope.embed = [
		"<iframe  width=\"100%\" height=\"400\" ",
		"src=\"" + $scope.publicFilePath() + "\" ",
		"frameborder=\"0\" allowfullscreen>",
		"</iframe>"
	].join("")
});
