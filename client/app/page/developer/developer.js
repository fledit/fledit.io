'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('page.developer', {
        url: '/developer',
        templateUrl: 'app/page/developer/developer.html',
        resolve: {
          sample: function($http) {
            return $http.get("app/page/developer/sample");
          }
        },
        controller: function($scope, sample) {
          $scope.codeSample = sample.data;
        }
      });
  });
