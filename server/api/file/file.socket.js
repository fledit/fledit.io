/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var file = require('./file.model');

exports.register = function(socket) {
  
  file.schema.post('save', function (doc) {
    onSave(socket, doc);
  });

  file.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });  

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
}

function onSave(socket, doc, cb) {
  socket.to("file:" + doc._id).emit('save', doc);
}

function onRemove(socket, doc, cb) {
  socket.to("file:" + doc._id).emit('remove', doc);
}