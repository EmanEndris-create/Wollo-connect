const express = require('express');
const userRouter = express.Router();
const authenticate = require ('../middlewares/auth.middleware');
const {onboard, getMe} = require('../controllers/user.controller');

userRouter.use(authenticate);

userRouter.post('/onboarding', onboard);
userRouter.get('/me', getMe)

module.exports = userRouter;