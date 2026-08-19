const express = require('express');
const chatRouter = express.Router();
const authenticate = require('../middlewares/auth.middleware');
const {getStreamToken} = require('../controllers/chat.controller');
const { get } = require('./user.routes');

chatRouter.use(authenticate);

chatRouter.get('/token', getStreamToken);

module.exports = chatRouter