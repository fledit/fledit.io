'use strict';

describe('Controller: DuplicateCtrl', function () {

  // load the controller's module
  beforeEach(module('fledit'));

  var DuplicateCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DuplicateCtrl = $controller('DuplicateCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
