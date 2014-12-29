'use strict';

angular.module('fledit').config(function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider.otherwise('/');
  // @src http://stackoverflow.com/questions/26824628/ui-router-state-current-wrapper-for-arbitary-state/26848546#26848546
  // This fn is called by StateBuilder each time a state is registered
  $stateProvider.decorator('parent', function (internalStateObj, parentFn) {
    // The first arg is the internal state. Capture it and add an accessor to public state object.
    internalStateObj.self.$$state = function() { return internalStateObj; };
    // pass through to default .parent() function
    return parentFn(internalStateObj);
  });
});
