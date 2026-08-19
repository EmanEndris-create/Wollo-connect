const pool = require('./db');

async function createTable() {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      image VARCHAR(255) DEFAULT '',
      skill VARCHAR(255) DEFAULT '',
      language VARCHAR(255) DEFAULT '',
      location VARCHAR(255) DEFAULT '',
      bio TEXT DEFAULT NULL,
      isOnboarded BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`;

  const userFriendsTable = `
    CREATE TABLE IF NOT EXISTS user_friends (
      user_id INT NOT NULL,
      friend_id INT NOT NULL,
      PRIMARY KEY (user_id, friend_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
  );
  `;

  const friendRequestsTable = `
  CREATE TABLE IF NOT EXISTS friend_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    status ENUM('pending', 'accepted') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (sender_id)
      REFERENCES users(id)
      ON DELETE CASCADE,

    FOREIGN KEY (recipient_id)
      REFERENCES users(id)
      ON DELETE CASCADE
  );
`;

  try{
    console.log('Creating Tables...');
    await pool.query(userTable);
    await pool.query(userFriendsTable);
    await pool.query(friendRequestsTable);
    console.log('Tables are created successfully.')
  }catch(error){
    console.error('Error happened when creating tables:', error);
  }
}

module.exports = createTable;