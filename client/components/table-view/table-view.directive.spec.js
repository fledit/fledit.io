'use strict';

describe('Directive: tableView', function () {

  // load the directive's module and view
  beforeEach(module('fledit'));
  beforeEach(module('components/table-view/table-view.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<table-view></table-view>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the tableView directive');
  }));
});