angular.module('fledit')
    .directive("dropzone", function() {
        return {
            restrict : "A",
            require: '^ngModel',
            scope: {
                dragClass: "=?"
            },
            link: function (scope, elem, attrs, ngModel) {

                elem.bind('dragover', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                });

                elem.bind('dragenter', function(evt) {
                    elem.addClass(scope.dragClass || 'dropzone--active');
                });

                elem.bind('dragleave', function(evt) {
                    elem.removeClass(scope.dragClass || 'dropzone--active');
                });

                elem.bind('drop', function(evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    elem.removeClass(scope.dragClass || 'dropzone--active');

                    var files = evt.originalEvent.dataTransfer.files;
                    _.each(files, function(file) {
                        var reader = new FileReader();
                        // Event when the file is loaded
                        reader.onload = function(loadEvent) {
                            scope.$apply(function() {
                                ngModel.$setViewValue(loadEvent.target.result);
                            })
                        };
                        // Read the file as text
                        reader.readAsText(file);
                    });
                });
            }
        }
    });
