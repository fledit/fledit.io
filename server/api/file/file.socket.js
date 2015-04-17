/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var file = require('./file.model'),
       _ = require('lodash');

// Subscribe to change on the file model
exports.subscribe = function(socketio) {

  file.schema.post('save', function (doc) {
    onSave(doc);
  });

  file.schema.post('remove', function (doc) {
    onRemove(doc);
  });

  function onSave(doc, cb) {
    doc = _.cloneDeep(doc);
    doc.secret = null;
    socketio.to("file:" + doc._id).emit('save', doc);
  }

  function onRemove(doc, cb) {
    doc = _.cloneDeep(doc);
    doc.secret = null;
    socketio.to("file:" + doc._id).emit('remove', doc);
  }
}

// Handle request for a single socket client
exports.register = function(socket) {

  // Allow a socket to subscribe to a file room
  socket.on("subscribe", function(id) {
  	// Does not join a file's room twice
  	socket.leave('file:' + id);
  	socket.join('file:' + id);
  });

  // Allow a socket to subscribe to a file room
  socket.on("unsubscribe", function(id) {
  	socket.leave('file:' + id);
  });

};
