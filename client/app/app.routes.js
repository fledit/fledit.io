'use strict';

angular.module('fledit')
  .config(function ($urlRouterProvider, $locationProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.hashPrefix('!')
    // @src http://stackoverflow.com/questions/26824628/ui-router-state-current-wrapper-for-arbitary-state/26848546#26848546
    // This fn is called by StateBuilder each time a state is registered
    var decoratorFn = function($state, parent) {
      // The first arg is the internal state. Capture it and add an accessor to public state object.
      $state.self.$$state = function() { return $state; };
      // pass through to default .parent() function
      return parent($state);
    };
    // We fake the DI to avoid a bug with ngAnnotate
    // @src https://github.com/olov/ng-annotate/issues/82#issuecomment-63346833
    decoratorFn.$inject = ['$state', 'parent'];
    $stateProvider.decorator('views', decoratorFn);

  }).run(function($rootScope, $state, $location, $window, Progress) {
    // Start progress indicator
    $rootScope.$on("$stateChangeStart", Progress.start);
    // Stop progress indicator
    $rootScope.$on("$stateChangeSuccess", function() {
      // Stop progress indicator
      Progress.complete();
      // Google Analytics  exists
      if($window.ga) {
        // Send 'pageview' to Google Analytics
        $window.ga('send', 'pageview', { page: $location.url() } );
      }
    });
    // Stop progress indicator
    $rootScope.$on("$stateChangeError", function() {
      // By default, go to the 404 state
      $state.go("404");
    });
  });
