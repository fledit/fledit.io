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
      socket: socket,
      /**
       * Register listeners to sync an array with updates on a room
       *
       * Takes the array we want to sync, the room name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} roomName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (roomName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'room:save'
         */
        socket.on(roomName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'room:remove'
         */
        socket.on(roomName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a rooms updates on the socket
       *
       * @param roomName
       */
      unsyncUpdates: function (roomName) {
        socket.removeAllListeners(roomName + ':save');
        socket.removeAllListeners(roomName + ':remove');
      }
    };
  });
