const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { db } = require('../database/db');

router.post('/api/register', async (req, res) => {
  try {
    console.log('Received registration request with body:', req.body);
    const { username, email, password } = req.body;

    // Validation logic here (check for existing users, validate email format, etc.)

    console.log(`Hashing password for user ${username}`);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Password hashed for user ${username}`);

    console.log(`Inserting new user into database: ${username}`);
    const newUser = await db.one(
      'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    console.log(`User registered: ${JSON.stringify(newUser)}`);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
    console.error(`Error response sent for registration request: ${JSON.stringify(error)}`);
  }
});

module.exports = router;
