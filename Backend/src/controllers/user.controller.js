const {onboardingUpdate, findUserById, recommendedUsers, myFriends} = require('../models/user.model');
const {partialUpdateUsers} = require('../config/stream.js');

const onboard = async(req, res)=>{
  try{
    const userId = req.userId;
    const { bio, skill, language, location}= req.body;

    if( !bio|| !skill|| !language|| !location){
      console.log('the onboarding inputs are not completed!');
      return res.status(400).json({
        message: 'Please fill in all the required fields for onboarding.',
        missingFields : [ !bio && 'bio', !skill && 'skill', !language && 'language', !location && 'location'].filter(Boolean)});
    }

    const result = await onboardingUpdate(userId, bio, skill, language, location);

    if(result.affectedRows === 0){
      return res.status(404).json({message: 'User not found or onboarding update failed.'});
    }

    const updatedUser = await findUserById(userId);

      try{
    await partialUpdateUsers({
    id: updatedUser.id.toString(),
    set:{
      bio: bio,
      skill: skill,
      language: language,
      location: location
    }
  });

    console.log('Stream user updated.');
  }catch(error){
    console.error('error updating stream user:', error);
  }

    console.log('onboarding update completed.');
    return res.status(200).json({message:'onboarding completed successfully'});
  }catch(error){
    console.error('Error during onboarding:', error);
    return res.status(500).json({
      message: 'Internal server error.'
    });
  }
};

const getMe = async(req, res)=>{
  try{
    const userId = req.userId;
    const user = await findUserById(userId);

    if(!user){
      console.log('User not found.');
      return res.status(404).json({
        message:'User not found.'
      });
    }
    console.log('users data returned.')
    return res.status(200).json({user});
  }catch(error){
    console.error('Error fetching current user:', error);
    return res.status(500).json({
      message: 'Internal server error.'
    });
  }
};

const getRecommendedUsers = async (req, res)=>{
  try{
    const userId = req.userId;

    const usersRecommended = await recommendedUsers(userId);

    if (usersRecommended.length === 0) {
      console.log('No recommended users found.');
      return res.status(404).json({
        message: 'No recommended users found.'
      });
    }
    console.log('recommended users are listed.');
    return res.status(200).json({
      users:usersRecommended
    });
  }catch(error){
    console.error('Error getting recommended users:', error);

    return res.status(500).json({ message: 'Internal server error.'});
  }
};

const getMyFriends = async(req, res)=>{
  try{
    const userId = req.userId;
    const friends = await myFriends(userId);
    console.log('friends are listed.');
    return res.status(200).json({friends});
  }catch(error){
    console.error('Error when getting friends:', error);
    return res.status(500).json({message: 'Internal Server Error.'});
  }
};

module.exports = {onboard, getMe, getRecommendedUsers, getMyFriends};
