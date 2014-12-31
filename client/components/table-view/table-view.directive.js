'use strict';

angular.module('fledit')
  .directive('tableView', function () {
    return {
      templateUrl: 'components/table-view/table-view.html',
      restrict: 'EA',
      controller: 'TableViewCtrl',
      scope: {
        data: "="
      }
    };
  });
