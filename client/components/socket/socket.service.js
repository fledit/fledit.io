/* global io */
'use strict';

angular.module('fledit').factory('socket', function(socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      //socket: socket,
      socket: socket,
      /**
       * Register listeners to watch changes on the given file
       *
       *
       * @param {String} fileId
       * @param {Function} cb
       */
      subscribe: function (fileId, cb) {
        cb = cb || angular.noop;
        // Subscrive to the given room
        socket.emit('subscribe', fileId, cb);
        return socket;
      },

      /**
       * Removes listeners for a rooms updates on the socket
       *
       * @param fileId
       */
      unsubscribe: function (fileId) {
        socket.removeAllListeners('save');
        socket.removeAllListeners('remove');
        // Subscrive to the given room
        socket.emit('unsubscribe', fileId);
        return socket;
      }
    };
  });
