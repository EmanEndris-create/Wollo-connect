const express = require('express');
const userRouter = express.Router();
const authenticate = require ('../middlewares/auth.middleware');
const {onboard, getMe, getRecommendedUsers} = require('../controllers/user.controller');

userRouter.use(authenticate);

userRouter.post('/onboarding', onboard);
userRouter.get('/me', getMe);
userRouter.get('/recommended', getRecommendedUsers);


module.exports = userRouter;