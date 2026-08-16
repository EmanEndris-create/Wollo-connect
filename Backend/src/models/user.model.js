const pool = require('../config/db');

async function existingUser({email}){
  const query = 'SELECT * FROM users WHERE email = ?';
  try{
    const [rows] = await pool.query(query, [email]);
    return rows.length > 0 ? rows[0] : null;
  }catch(error){
    console.error('Error checking existing user:', error);
    throw error;
  }
}

async function createUser({fullName, email, password, image}){
  const query = 'INSERT INTO users (fullName, email, password, image) VALUES (?, ?, ?, ?)';
  const values = [fullName, email, password, image];
  try{
    const [result] = await pool.query(query, values);
    console.log('New user is created successfully.');
    return result.insertId;
  }catch(error){
    console.error('Error creating new user:', error);
    throw error;
  }
}

async function onboardingUpdate(userId, fullName, bio, skill, language, location){
  const query = `UPDATE users
    SET fullName = ?, bio = ?, skill = ?, language = ?, location = ?, isOnboarded = TRUE
    WHERE id = ?`;
    const values = [fullName, bio, skill, language, location, userId];

  const [result] = await pool.query(query, values);
  return result;
};

async function findUserById(userId){
  const query = `
  SELECT id, fullName, email, image, skill, language, location, bio, isOnboarded, createdAt, updatedAt
  FROM users
  WHERE id = ?`;

  const [rows] = await pool.query(query, [userId]);

  return rows[0];
};

module.exports = {existingUser, createUser, onboardingUpdate, findUserById};