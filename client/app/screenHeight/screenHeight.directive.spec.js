'use strict';

describe('Directive: screenHeight', function () {

  // load the directive's module
  beforeEach(module('fledit'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<screen-height></screen-height>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the screenHeight directive');
  }));
});