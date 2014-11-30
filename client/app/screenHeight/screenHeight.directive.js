angular.module('fledit').directive("screenHeight", ["$window", function($window) {	
    return function(scope, element, attrs) {
     	var ev = "resize.screenHeight";
     	var resize = function() {
	        element.css("height", $window.innerHeight);
	        if (!isNaN(attrs.screenHeight)) {
	        	return element.css("min-height", 1 * attrs.screenHeight);
	        }
      	};
      	
      	resize();
      	angular.element($window).bind(ev, resize);
      	
      	scope.$on('$destroy', function() {
        	angular.element($window).unbind(ev);
      	});
    };
  }
]);
