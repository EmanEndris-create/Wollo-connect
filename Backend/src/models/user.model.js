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

async function recommendedUsers(userId) {
  const query = `SELECT
      otherUser.id,
      otherUser.fullName,
      otherUser.email,
      otherUser.image,
      otherUser.skill,
      otherUser.language,
      otherUser.location,
      otherUser.bio,
      otherUser.isOnboarded,

      (
        CASE WHEN otherUser.skill = currentUser.skill THEN 5 ELSE 0 END +
        CASE WHEN otherUser.language = currentUser.language THEN 2 ELSE 0 END +
        CASE WHEN otherUser.location = currentUser.location THEN 1 ELSE 0 END
      ) AS matchScore

    FROM users otherUser
    JOIN users currentUser
      ON currentUser.id = ?

    WHERE
      otherUser.id != ?
      AND otherUser.isOnboarded = TRUE
      AND NOT EXISTS (
        SELECT 1
        FROM user_friends uf
        WHERE
          (uf.user_id = ? AND uf.friend_id = otherUser.id)
          OR
          (uf.friend_id = ? AND uf.user_id = otherUser.id)
      )

    ORDER BY matchScore DESC, otherUser.createdAt DESC
    LIMIT 20`;
  const values = [userId,userId,userId,userId];

  const [rows] = await pool.query(query, values);
  return rows;
}

module.exports = {existingUser, createUser, onboardingUpdate, findUserById, recommendedUsers};
