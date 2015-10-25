'use strict';

angular.module('fledit').config(function ($stateProvider) {
	$stateProvider.state('main.mine', {
		url: 'mine',
		templateUrl: 'app/main/mine/mine.html',
		controller: 'MainMineCtrl',
		resolve: {
			mine: function(Auth, Restangular, $q) {
				var deferred = $q.defer();
				Auth.isLoggedInAsync(function(loggedIn) {
					// Not logged in, we return an empty dataset
					if(!loggedIn) { return deferred.resolve([]); }
					// Logged in, we load user's files
					Restangular
						.all('files')
						.all('mine')
						.getList()
						.then(deferred.resolve, deferred.reject);
				});

				return deferred.promise;
			}
		}
	});
});
