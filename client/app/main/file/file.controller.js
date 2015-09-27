'use strict';

angular.module('fledit').controller('MainFileCtrl', function ($scope, $document, $state, socket, file, Restangular, $stateParams, $location, filemanager) {
  var editor = $scope.updatedFile = null;
  // Copy of the database file to watch changes
  var master = file.clone();
  // Save the editor instance for further update
  // @tofix: ui-ace doesn't support changes from the scope, updating the editor
  // is a temporary solution (clue: ngModel.$render isn't called).
  $scope.prepareEditor = function(session) {
    editor = session;
    // Bind shortcuts only if a secret is present
    if( file.secret ) {
      // We add a command to submit the form from the keep board
      editor.commands.addCommand({
        name: "submit",
        exec: function() {
          $scope.$apply(function() {
            return $scope.noParseError($scope.content) && $scope.saveFile()
          });
        },
        bindKey: "Ctrl-S"
      });
    }
  }
  // Path to the api endpoint of the current file
  $scope.rawFilePath = function() {
    var secureFile = file.clone()
    var baseUrl = $location.absUrl().split( "/#!" + $location.path() )[0]
    return baseUrl + secureFile.getRequestedUrl();
  };
  // Admin link
  $scope.adminFilePath = function() {
    return $state.href("main.file", {id: file._id, secret: $scope.secret}, {absolute: true});
  };
  // Public link
  $scope.publicFilePath = function() {
    return $state.href("main.file", {id: file._id}, {absolute: true});
  };
  // Remove the given file
  $scope.remove = function(file, secret) {
    // Ask for confirmation
    if( confirm("This file will be lost for you and every people who are using it. Are you sure?") ) {
      // Take id and secret from state parameters
      Restangular.one("files", file._id).remove({ secret: file.secret || secret});
      // Remove it from "my files"
      filemanager.remove(file._id);
      // Redirect to the main state
      $state.go("main");
    }
  }
  // This will parse the text content, add
  // the secret key and save the file
  $scope.saveFile = function() {
    // Avoid reloading file
    $scope.updatedFile = null;
    // Parse text content to JSON
    file.content = angular.fromJson($scope.content)
    // And save
    file.save().then( function(updatedFile) {
      file.updated_at = updatedFile.updated_at
      file.valid      = updatedFile.valid
      // Update local copy
      master = file.clone()
      // Update the file manager
      filemanager.save(file);
    });
  };
  // Use the $scope.updatedFile to update the file object (once)
  $scope.refreshFile = function() {
    angular.extend(file, $scope.updatedFile);
    $scope.updatedFile = null;
  };
  // Use the $scope.updatedFile to update the file object (once)
  $scope.mustRefreshFile = function() {
    return $scope.updatedFile !== null && $scope.updatedFile.updated_at !== file.updated_at;
  };
  // File change only when the parsed edtior content is different than the one
  // save into the file object. Parsing error returns false.
  $scope.fileChanged = function() {
    try {
      content = angular.fromJson($scope.content);
      return ! _.isEqual(content, master.content) || !_.isEqual(file.name, master.name);
    } catch(e) {
      return false
    }
  };

  // True if the current file can be visualised as a table
  $scope.hasTableView = function() {
    // Enumerable type
    return $scope.secret && file && [Array, Object].indexOf(file.constructor) > -1;
  };

  // True if the current file can be visualised as a form
  $scope.hasFormView = function() {
    return $scope.secret && file.validator;
  };

  // Unsubscribe to the file when the scope is destroyed
  $scope.$on("$destroy", function() { socket.unsubscribe(file._id) });
  // Subscribe to
  socket.subscribe(file._id).on("save", function(updatedFile) {
    $scope.updatedFile = updatedFile;
  });

  // If a secret is given, we must store it and change search
  if($stateParams.secret) {
    $scope.secret = $stateParams.secret;
    // Save the secret token in local storage
    filemanager.save(file);
    // Reset the search parameter
    $location.search("secret", null);
  // A secret might by given from localstorage
  } else {
    $scope.secret = file.secret;
  }

  // Watch current file instance
  $scope.$watch(function() { return file.content; }, function() {
    // Does the file exist?
    if(file) {
      // Stringify received JSON to allow edition
      $scope.file = file;
      $scope.content = JSON.stringify(file.content, null, 4);
      // Does the editor already rexist?
      if(editor && editor.getValue() !== $scope.content ) {
        editor.setValue($scope.content);
        // The readonly html attribute may not work on ui-ace
        // after reseting its value
        editor.setReadOnly(!file.secret);
      }
    }
  // Deep watch
  }, true);
});
