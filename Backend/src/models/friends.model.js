const pool = require('../config/db');

async function areFriends(userId, otherUserId) {
  const query = `
    SELECT 1
    FROM user_friends
    WHERE
      (user_id = ? AND friend_id = ?)
      OR
      (user_id = ? AND friend_id = ?)
    LIMIT 1
  `;
  const values = [userId, otherUserId, otherUserId, userId];

  const [rows] = await pool.query(query, values);

  return rows.length > 0;
};

async function findExistingFriendRequest(senderId, recipientId) {
  const query = `
    SELECT *
    FROM friend_requests
    WHERE
      (sender_id = ? AND recipient_id = ?)
      OR
      (sender_id = ? AND recipient_id = ?)
    LIMIT 1
  `;
  const values = [senderId, recipientId, recipientId, senderId];

  const [rows] = await pool.query(query, values);

  return rows[0];
};

async function createFriendRequest(senderId, recipientId) {
  const query = `
    INSERT INTO friend_requests
      (sender_id, recipient_id)
    VALUES (?, ?)
  `;
  const values = [senderId, recipientId];

  const [result] = await pool.query(query, values);

  return result.insertId;
};

async function deleteFriendRequest(senderId, recipientId) {
  const query = `DELETE FROM friend_requests
  WHERE sender_id = ?
  AND recipient_id = ?
  AND status = 'pending'
  `;

  const [result] = await pool.query(query, [senderId, recipientId]);
  return result;
  
};

async function getIncomingFriendRequests(userId) {
  const query = `
    SELECT
      fr.id,
      fr.sender_id,
      fr.recipient_id,
      fr.status,
      fr.createdAt,

      u.id AS senderId,
      u.fullName,
      u.image,
      u.skill,
      u.language,
      u.location,
      u.bio

    FROM friend_requests fr

    JOIN users u
      ON u.id = fr.sender_id

    WHERE
      fr.recipient_id = ?
      AND fr.status = 'pending'

    ORDER BY fr.createdAt DESC
  `;

  const [rows] = await pool.query(query, [userId]);

  return rows;
};

async function getAcceptedFriendRequests(userId) {
  const query = `
    SELECT
      fr.id,
      fr.sender_id,
      fr.recipient_id,
      fr.status,
      fr.createdAt,

      u.id AS recipientId,
      u.fullName,
      u.image

    FROM friend_requests fr

    JOIN users u
      ON u.id = fr.recipient_id

    WHERE
      fr.sender_id = ?
      AND fr.status = 'accepted'

    ORDER BY fr.createdAt DESC
  `;

  const [rows] = await pool.query(query, [userId]);

  return rows;
}

async function findOutgoingFriendRequests(userId) {
  const query = `
    SELECT
      fr.id,
      fr.sender_id,
      fr.recipient_id,
      fr.status,
      fr.createdAt,

      u.id AS recipientId,
      u.fullName,
      u.image,
      u.language,
      u.skill

    FROM friend_requests fr

    JOIN users u
      ON u.id = fr.recipient_id

    WHERE
      fr.sender_id = ?
      AND fr.status = 'pending'

    ORDER BY fr.createdAt DESC
  `;

  const [rows] = await pool.query(query, [userId]);

  return rows;
}

async function findFriendRequestById(requestId) {
  const query = `
    SELECT *
    FROM friend_requests
    WHERE id = ?
  `;

  const [rows] = await pool.query(query, [requestId]);
  return rows[0];
};

async function updateFriendRequestStatus(requestId) {
  const query = `
    UPDATE friend_requests
    SET status = 'accepted'
    WHERE id = ?
  `;

  const [result] = await pool.query(query, [requestId]);

  return result;
};

async function addFriend(userId, friendId) {
  const query = `
    INSERT INTO user_friends (user_id, friend_id)
    VALUES (?, ?)
  `;
  const values = [userId, friendId];
  const [result] = await pool.query(query, values);

  return result;
}

module.exports = {areFriends, findExistingFriendRequest, createFriendRequest, deleteFriendRequest, getIncomingFriendRequests, getAcceptedFriendRequests, findOutgoingFriendRequests, findFriendRequestById, updateFriendRequestStatus, addFriend};