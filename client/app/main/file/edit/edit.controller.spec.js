'use strict';

describe('Controller: MainFileEditCtrl', function () {

  // load the controller's module
  beforeEach(module('fledit'));

  var MainFileEditCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainFileEditCtrl = $controller('MainFileEditCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
