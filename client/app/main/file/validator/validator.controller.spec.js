'use strict';

describe('Controller: ValidatorCtrl', function () {

  // load the controller's module
  beforeEach(module('fledit'));

  var ValidatorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ValidatorCtrl = $controller('ValidatorCtrl', {
      $scope: scope
    });
  }));

});
