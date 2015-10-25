'use strict';

var express = require('express');
var controller = require('./file.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/search', controller.search);
router.get('/mine', auth.isAuthenticated(), controller.mine);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.patch('/:id/claim',  auth.isAuthenticated(), controller.claim);
router.delete('/:id', controller.delete);

module.exports = router;
