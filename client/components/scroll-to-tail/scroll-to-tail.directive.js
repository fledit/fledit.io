'use strict';

angular.module('fledit')
  .directive('scrollToTail', function ($timeout) {
    return {
      restrict: 'A',
      scope: {
        scrollToTail: "="
      },
      link: function (scope, element, attrs) {
        scope.$watch("scrollToTail", function(value) {
          if(value) {
            $(element).delay(200).animate({
              scrollLeft: element[0].scrollWidth
            }, 600);
          }
        })
      }
    };
  });
