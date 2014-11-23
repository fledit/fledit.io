'use strict';

describe('Controller: MineCtrl', function () {

  // load the controller's module
  beforeEach(module('fledit'));

  var MineCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MineCtrl = $controller('MineCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
