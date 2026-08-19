const validator = require('validator');
const bcrypt = require('bcrypt');
const {existingUser, createUser} = require('../models/user.model');
const {upsertStreamUser} = require('../config/stream.js');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const comparePassword = require('../utils/comparePassword.js');

const signup = async(req, res)=>{
  try{
  const {fullName, email, password} = req.body;
  
  if(!fullName || !email || !password){
    console.log('The required fields are missing!');
    return res.status(400).json({message: 'Please provide all required fields.'});
  }

  if(!validator.isEmail(email)){
    console.log('The entered email is not valid!');
    return res.status(400).json({message: 'please enter a valid email address.'});
  }

  const user = await existingUser({email});
  if(user){
    console.log('The user already exists!');
    return res.status(400).json({message: 'User with this email already exists.'});
  }

  if(password.length < 6){
    console.log('The password is too short!');
    return res.status(400).json({message: 'Password must be at least 6 characters long.'});
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const idx = Math.floor(Math.random() * 1000) + 1;
  const randomAvatar = `https://api.dicebear.com/10.x/adventurer-neutral/svg?seed=alexander${idx}`;

  const newUserId = await createUser({
    fullName,
    email,
    password: hashedPassword,
    image: randomAvatar,
  });

  try{
    await upsertStreamUser({
    id: newUserId.toString(),
    name: fullName,
    image: randomAvatar || "",
  });

    console.log(`Stream user upserted for ${fullName}`);
  }catch(error){
    console.error('error upserting stream user:', error);
  }

  const accessToken = generateToken(res, newUserId);

  return res.status(201).json({message: 'User signed up successfully.', accessToken});

}catch(error){
  console.error('Error during signup:', error);
  return res.status(500).json({message: 'Internal server error.'});
}
};

const signin = async(req, res)=>{
  try{
    const {email, password} = req.body;
    
    if(!email || !password){
      console.log('The required fields are missing!');
      return res.status(400).json({message: 'Please enter both email and password.'});
    }

    const user = await existingUser({email});
    if(!user){
      console.log('please Sign up first.');
      return res.status(400).json({message: 'please Sign up first.'});
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid){
      console.log('Invalid email or password.');
      return res.status(400).json({message: 'Invalid email or password.'});
    }

    const accessToken = generateToken(res, user.id);

    console.log('User signed in successfully.');

    return res.status(200).json({message: 'User signed in successfully.', accessToken});
  }catch(error){
    console.error('Error during signin:', error);
    return res.status(500).json({message: 'Internal server error.'});
  }
}

const logout = async(req, res)=>{
  try{
    res.clearCookie('refreshToken',{
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    console.log('User logged out successfully.');
    return res.status(200).json({message: 'User logged out successfully.'});
  }catch(error){
    console.error('Error during logout:', error);
    return res.status(500).json({message: 'Internal server error.'});
  }
}

const refresh = async(req, res)=>{
  try{
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken){
      return res.status(401).json({message: 'Refresh token required.'});
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const userId = decoded.userId;

    const {accessToken} = generateToken(res, userId);

    console.log('Access token refreshed successfully.');
    return res.status(200).json({message: 'Access token refreshed successfully.'});
  }catch(error){
    console.log('invalid or expired refresh token');
    return res.status(401).json({message: 'Invalid or expired refresh token.'});
}
};

module.exports= {signup, signin, logout, refresh};