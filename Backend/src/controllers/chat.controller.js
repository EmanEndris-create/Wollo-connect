const {generateStreamToken} = require ('../config/stream');

const getStreamToken = async (req, res)=>{
  try{
    const userId = req.userId;
    const token = generateStreamToken(userId);

    console.log('stream token sent.');
    return res.status(200).json({token});
  }catch(error){
    console.error('Error generating Stream token:', error);
    return res.status(500).json({message: 'Internal server error.'});
  }
};

module.exports={getStreamToken};