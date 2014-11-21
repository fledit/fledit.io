'use strict';

describe('Controller: UseCtrl', function () {

  // load the controller's module
  beforeEach(module('fledit'));

  var UseCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UseCtrl = $controller('UseCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
