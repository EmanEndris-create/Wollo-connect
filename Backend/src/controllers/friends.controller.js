const {findUserById} = require('../models/user.model');
const {areFriends, findExistingFriendRequest, createFriendRequest, deleteFriendRequest,  getIncomingFriendRequests, getAcceptedFriendRequests, findOutgoingFriendRequests, findFriendRequestById, updateFriendRequestStatus, addFriend} = require('../models/friends.model');

const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.userId;
    const recipientId = req.params.id;

    console.log('Sender:', senderId);
    console.log('Recipient:', recipientId);

    if (Number(senderId) === Number(recipientId)) {
      console.log('You cannot send a friend request to yourself.');
      return res.status(400).json({
        message: 'You cannot send a friend request to yourself.'
      });
    }

    const recipient = await findUserById(recipientId);
    if (!recipient) {
      console.log('Recipient user not found.');
      return res.status(404).json({
        message: 'Recipient user not found.'
      });
    }

    const alreadyFriends = await areFriends(senderId, recipientId);
    if (alreadyFriends) {
      console.log('You are already friends with this user.');
      return res.status(400).json({
        message: 'You are already friends with this user.'
      });
    }

    const existingRequest =
    await findExistingFriendRequest(senderId, recipientId);
    if (existingRequest) {
      console.log('A friend request already exists between you.');
      return res.status(400).json({
        message: 'A friend request already exists between you.'
      });
    }

    const requestId = await createFriendRequest(senderId, recipientId);
    console.log('Friend request sent successfully.');
    return res.status(201).json({message: 'Friend request sent successfully.', requestId});

  } catch (error) {
    console.error('Error sending friend request:', error);

    return res.status(500).json({
      message: 'Internal server error.'
    });
  }
};


const cancelFriendRequest = async(req, res)=>{
  try {
    const senderId = req.userId;
    const recipientId = Number(req.params.id);

    if (senderId === recipientId){
      console.log('You cannot cancel a friend request to yourself.');
      return res.status(400).json({
        message: 'You cannot cancel a friend request to yourself.'
      });
    }

    const result = await deleteFriendRequest(senderId, recipientId);

    if(result.affectedRows === 0){
      return res.status(404).json({
        message: "Pending friend request not found or already accepted."
      });
    }

    return res.status(200).json({
      message:"Friend request cancelled successfully."
    });

  } catch (error) {
    console.error('Error cancelling friend request:', error);
    return res.status(500).json({
      message:'Internal server error.' 
    });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const incomingRequests = await getIncomingFriendRequests(userId);

    const acceptedRequests =await getAcceptedFriendRequests(userId);

    console.log('requests sre sent.')
    return res.status(200).json({incomingRequests, acceptedRequests});

  } catch (error) {
    console.error('Error getting friend requests:', error);

    return res.status(500).json({message: 'Internal server error.' });
  }
};

const getOutgoingFriendRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const outgoingRequests =await findOutgoingFriendRequests(userId);

    console.log('outgoing requests are sent.')
    return res.status(200).json(outgoingRequests);

  } catch (error) {
    console.error('Error getting outgoing friend requests:',error);
    return res.status(500).json({message: 'Internal server error.'});
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const requestId = req.params.id;

    const friendRequest =
      await findFriendRequestById(requestId);

    if (!friendRequest) {
      console.log('Friend request not found.');
      return res.status(404).json({
        message: 'Friend request not found.'
      });
    }

    if (Number(friendRequest.recipient_id) !== Number(userId)) {
      console.log('The recipient is not authorized to accept friend request.');
      return res.status(403).json({
        message: 'You are not authorized to accept this friend request.'
      });
    }

    if (friendRequest.status !== 'pending') {
      console.log('This friend request has already been processed.');
      return res.status(400).json({message: 'This friend request has already been processed.'});
    }

    await updateFriendRequestStatus(requestId, 'accepted');
    await addFriend(userId, friendRequest.sender_id);
    await addFriend(friendRequest.sender_id, userId);

    console.log('Friend request accepted successfully.');
    return res.status(200).json({
      message: 'Friend request accepted successfully.'
    });

  } catch (error) {
    console.error('Error accepting friend request:', error);

    return res.status(500).json({
      message: 'Internal server error.'
    });
  }
};

module.exports = {sendFriendRequest, cancelFriendRequest, getFriendRequests, getOutgoingFriendRequests, acceptFriendRequest};
