'use strict';

describe('Controller: MainFileValidatorCtrl', function () {

  // load the controller's module
  beforeEach(module('fledit'));

  var MainFileValidatorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainFileValidatorCtrl = $controller('MainFileValidatorCtrl', {
      $scope: scope
    });
  }));

});
