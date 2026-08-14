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

module.exports = {existingUser, createUser};