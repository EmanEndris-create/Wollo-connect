const express = require('express');
const userRouter = express.Router();
const authenticate = require ('../middlewares/auth.middleware');
const {onboard, getMe, getRecommendedUsers, getMyFriends} = require('../controllers/user.controller');
const {sendFriendRequest, getFriendRequests, getOutgoingFriendRequests,acceptFriendRequest} = require('../controllers/friends.controller');

userRouter.use(authenticate);

userRouter.post('/onboarding', onboard);
userRouter.get('/me', getMe);
userRouter.get('/recommended', getRecommendedUsers);
userRouter.get('/friends', getMyFriends);
userRouter.post('/friend-request/:id', sendFriendRequest);
userRouter.get('/friend-requests', getFriendRequests);
userRouter.get('/friend-requests/outgoing', getOutgoingFriendRequests);
userRouter.post('/friend-request/accept/:id', acceptFriendRequest);


module.exports = userRouter;