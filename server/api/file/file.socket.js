/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var file = require('./file.model'),
       _ = require('lodash');

// Subscribe to change on the file model
exports.subscribe = function(socketio) {

  file.schema.post('save', onSave);
  file.schema.post('remove', onRemove);

  function onSave(doc) {
    doc = doc.toObject();
    doc.secret = null;
    socketio.to("file:" + doc._id).emit('save', doc);
  }

  function onRemove(doc) {
    doc = doc.toObject();
    doc.secret = null;
    socketio.to("file:" + doc._id).emit('remove', doc);
  }
}

// Handle request for a single socket client
exports.register = function(socket) {

  // Allow a socket to subscribe to a file room
  socket.on("subscribe", function(id) {
    var room = 'file:' + id;
  	// Does not join a file's room twice
  	socket.leave(room);
  	socket.join(room);
    // Log entrance
    console.info('[%s] JOIN %s', socket.handshake.address, room);
  });

  // Allow a socket to subscribe to a file room
  socket.on("unsubscribe", function(id) {
    var room = 'file:' + id;
  	socket.leave(room);
    // Log exit
    console.info('[%s] LEAVE %s', socket.handshake.address, room);
  });

};
