'use strict';

angular.module('fledit')
  .controller('SearchCtrl', function ($scope, $state, $stateParams, files, Paginator) {
    $scope.search = new Paginator(files);
    $scope.search.q = $stateParams.q;
    // Submit a new search, go straight to the same state
    $scope.submit = function(q) { $state.go('search', { q: q }); };
  });
