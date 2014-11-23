'use strict';

angular.module('fledit').config(function ($stateProvider) {
	$stateProvider.state('main.mine', {
		url: 'mine',
		templateUrl: 'app/main/mine/mine.html',
		controller: 'MainMineCtrl'
	});
});