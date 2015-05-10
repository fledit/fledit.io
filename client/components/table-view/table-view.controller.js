'use strict';

angular.module('fledit').controller('TableViewCtrl', function ($scope, $rootScope) {


  var isLiteralArray = function() {
    return $scope.data.constructor === Array && headers.length === 0;
  };

  var isObject = function() {
    return $scope.data.constructor === Object;
  }

  // Transpose values from the table to the file content
  var transposeToTable = function(line, col, value) {
    if( isLiteralArray() )  {
      // Create missing rows
      for(var r = $scope.data.length - 1; r < line;   r++) $scope.data.push(null);
      // Simply change the value
      $scope.data[line] = isNaN(value) ? value : 1*value;
    } else if( isObject() )  {
      var key = _.keys($scope.data)[line];
      $scope.data[key] = value;
    } else {
      // Retreive its key
      var key = headers[col];
      // Create missing rows
      for(var r = $scope.data.length - 1; r < line; r++) $scope.data.push({});
      // Simply change the value
      $scope.data[line][key] = value;
    }
  };

  var typeToCellType = function(type) {
    switch(1*type) {
      case BOOLEAN: return  'checkbox';
      case NUMBER:  return  'numeric';
      case OBJECT:  return  'object';
      default:      return  'text';
    }
  }

  // Event after the table changed
  var afterChange = function(rows, ev) {
    switch(ev) {
      // Do not transpose data when the data are just loaded
      case "loadData": break;
      // Transpose values from the table to the file content
      default:
        angular.forEach(rows, function(row) {
          $scope.$apply(function() {
            transposeToTable(row[0], row[1], row[3]);
          });
        });
    }
  };

  // Guess the type of a column based on its 70 first values
  var guessColType = function(key) {
    var values = $scope.data.slice(0, 70),
    // By default, the best type is string
      bestType = STRING,
    // Maximum popularity starts to 0
        maxPop = 0,
    // Popularity of each type
      typesPop = {};
    // Initial popularity
    typesPop[NUMBER] = typesPop[STRING] = typesPop[BOOLEAN] = typesPop[OBJECT] = 0;

    angular.forEach(values, function(row) {
      if(row[key] === null || row[key] === undefined) return;
      switch( typeof(row[key]) ) {
        case typeof(1):
          ++typesPop[NUMBER]
          break
        case typeof(true):
          ++typesPop[BOOLEAN]
          break
        case typeof({}):
          ++typesPop[OBJECT]
          break
        default:
          ++typesPop[STRING]
          break
      }
    });

    // Choose the best type
    angular.forEach(typesPop, function(pop, type) {
      if(pop > maxPop) {
        maxPop = pop;
        bestType = type
      }
    });

    return bestType;
  };

  var objectRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    cellProperties.readOnly = true;
    td.className = 'handsontable__cell--object';
    td.innerHTML = '<a>Multiple values</a>';
    $("a", td).on("click", function() {
      instance.deselectCell();
      $scope.$apply(function() {
        $rootScope.$broadcast("table-view:edit-properties", {properties: value, parent: $scope.data });
      });
    });
  };

  var dynamicRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    if(  value !== null && [Array, Object].indexOf(value.constructor) > -1 ) {
      objectRenderer.apply(this, arguments);
    } else if( !isNaN(value) ) {
      Handsontable.renderers.NumericRenderer.apply(this, arguments);
    } else if( typeof(value) === 'boolean' ) {
      Handsontable.renderers.BooleanRenderer.apply(this, arguments);
    } else {
      Handsontable.renderers.TextRenderer.apply(this, arguments);
    }
  }


  var getHeaders = function() {
    var headers = [];
    // No headers for object
    if( isObject() ) return headers;
    // Will contain the name of every available column
    // Collect every row's keys
    angular.forEach($scope.data, function(row) {
      headers = headers.concat( _.keys(row) );
    });
    // Removes duplicates from the column names
    return _.unique(headers);
  };

  var getColumns = function() {
    // literal array has no typed column
    if( isLiteralArray() || isObject() ) return null;
    // Array of columns
    return _.map(headers, function(key) {
      // Guess type for every header
      var type = typeToCellType( guessColType(key) ),
      // Cell's option
      options = {
        type: type,
        title: key
      };
      // Object gets a very special treatment
      if( type === 'object') {
        angular.extend(options, {
          type: 'text',
          readOnly: true,
          renderer: objectRenderer
        });
      }
      return options;
    });
  };

  // True if the current file can be visualised as table
  $scope.hasTableView = function() {
    // Enumerable type
    return $scope.data && [Array, Object].indexOf($scope.data.constructor) > -1;
  };


  // Handsometable settings
  $scope.tableSettings = {};
  // Stop here if the current data can't be visualised as a table
  if( ! $scope.hasTableView() ) return;
  // All headers
  var headers = getHeaders();
  // Cell types
  var NUMBER = 0, BOOLEAN = 1, STRING = 2, OBJECT = 3;

  // Has no headers, it might be an array of literal values
  if( isLiteralArray() ) {
    $scope.dataAsTable = _.map($scope.data, function(row) { return [row] });
    $scope.tableSettings.cells = function (row, col, prop) {
      this.renderer = dynamicRenderer;
    };
  } else if( isObject() ) {
    $scope.dataAsTable = _.map( _.keys($scope.data), function(key) { return [$scope.data[key]] });
    // Object table uses custom settings
    angular.extend($scope.tableSettings, {
      rowHeaders: _.keys($scope.data),
      minSpareRows: 0,
      maxRows: _.keys($scope.data).length,
      // Object uses a dynamic renderer
      cells: function (row, col, prop) {
        this.renderer = dynamicRenderer;
      }
    });
  } else {
    // Transform the date to fits with the headers
    $scope.dataAsTable = _.map($scope.data, function(row) {
      var newRow = [];
      angular.forEach(headers, function(key) {
        newRow.push(row[key]);
      });
      return newRow;
    });
  }

  $scope.tableSettings = angular.extend({
    colHeaders: true,
    rowHeaders: true,
    columnSorting: true,
    persistentState: true,
    columns: getColumns(),
    minSpareRows: 1,
    readOnly: !!$scope.readOnly,
    afterChange: afterChange
  }, $scope.tableSettings);

});
