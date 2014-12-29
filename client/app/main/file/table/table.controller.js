'use strict';

angular.module('fledit').controller('MainFileTableCtrl', function ($scope, file) {

  // Transpose values from the table to the file content
  var transposeToTable = function(line, col, value) {
    // Retreive its key
    var key = headers[col];
    // Simply change the value
    file.content[line][key] = value;
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
    var values = file.content.slice(0, 70),
    // By default, the best type is string
      bestType = STRING,
    // Maximum popularity starts to 0
        maxPop = 0,
    // Popularity of each type
      typesPop = {};
    // Initial popularity
    typesPop[NUMBER] = typesPop[STRING] = typesPop[BOOLEAN] = typesPop[OBJECT] = 0;

    angular.forEach(values, function(row) {

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

  // Cell types
  var NUMBER = 0, BOOLEAN = 1, STRING = 2, OBJECT = 3;
  var headers = [], columns = [];

  $scope.file = file;
  // A table view of the file
  $scope.fileAsTable = []
  // Stop here if the current file can't be visualised as a table
  if( ! $scope.hasTableView() ) return;

  // Will contain the name of every available column
  // Collect every row's keys
  angular.forEach(file.content, function(row) {
    headers = headers.concat( _.keys(row) );
  });
  // Removes duplicates from the column names
  headers = _.unique(headers);
  columns = _.map(headers, function(key) {
    // Guess type for every header
    return { type: typeToCellType( guessColType(key) ), title: key };
  });
  // Removes column with objects
  columns = _.filter(columns, function(f) { return f.type !== 'object' });
  headers = _.pluck(columns, 'title');

  $scope.tableSettings = {
    colHeaders: true,
    columnSorting: true,
    persistentState: true,
    columns: columns,
    minSpareRows: 0,
    afterChange: afterChange
  };

  // Transform the date to fits with the headers
  angular.forEach(file.content, function(row) {
    var newRow = [];
    angular.forEach(headers, function(key) {
      newRow.push(row[key]);
    });
    $scope.fileAsTable.push(newRow);
  });

});
