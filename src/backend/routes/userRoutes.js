const express = require('express');
const router = express.Router();
const { db } = require('../database/db');

// Get all users
router.get('/api/users', async (req, res) => {
  try {
    console.log('Request to GET /api/users received');
    const users = await db.any('SELECT * FROM users');
    console.log(`Fetched ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
    console.error(`Error response sent for GET /api/users: ${JSON.stringify(error)}`);
  }
});

// Add a new user
router.post('/api/users', async (req, res) => {
  const { username, weight, height, gender } = req.body;
  try {
    console.log(`Request to POST /api/users received with data: ${JSON.stringify(req.body)}`);
    const newUser = await db.one(
      'INSERT INTO users(username, weight, height, gender) VALUES($1, $2, $3, $4) RETURNING *',
      [username, weight, height, gender]
    );
    console.log(`New user added: ${JSON.stringify(newUser)}`);
    res.json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Internal server error' });
    console.error(`Error response sent for POST /api/users: ${JSON.stringify(error)}`);
  }
});

module.exports = router;
