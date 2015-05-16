'use strict';

angular.module('fledit')
  .config(function ($stateProvider) {
    $stateProvider
      .state('page.developer', {
        url: '/developer',
        templateUrl: 'app/page/developer/developer.html',
        resolve: {
          sample: function($http) {
            return $http.get("assets/data/sample.js");
          }
        },
        controller: function($scope, sample) {
          $scope.codeSample = sample.data;
        }
      });
  });
