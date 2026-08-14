const express = require('express');
const authRouter = express.Router();
const {signup, signin, logout, refresh} = require('../controllers/auth.controller');

authRouter.post('/signup', signup);

authRouter.post('/login', signin);

authRouter.post('/logout', logout);

authRouter.post('/refresh', refresh);

module.exports = authRouter;