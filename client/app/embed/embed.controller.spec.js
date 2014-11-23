'use strict';

describe('Controller: EmbedCtrl', function () {

  // load the controller's module
  beforeEach(module('fledit'));

  var EmbedCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmbedCtrl = $controller('EmbedCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
