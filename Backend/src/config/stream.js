const {StreamChat} = require('stream-chat');

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
  console.error('Stream API key or secret is not set in environment variables.');
  throw new Error('Stream API key or secret is not set in environment variables.');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

const upsertStreamUser = async(userData)=>{
  try{
    const response = await streamClient.upsertUsers([userData]);

    console.log('stream response:', response);

    return userData;
  }catch(error){
    console.error('Error upserting user to Stream:', error);
    throw error;
  }
}

module.exports = upsertStreamUser;