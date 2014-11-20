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
}

function onSave(socket, doc, cb) {
  socket.emit('file:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('file:remove', doc);
}