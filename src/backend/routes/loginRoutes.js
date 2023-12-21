const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { db } = require('../database/db');

router.post('/api/login', async (req, res) => {
  try {
    console.log('Received login request with body:', req.body);
    const { usernameOrEmail, password } = req.body;

    console.log(`Attempting to find user: ${usernameOrEmail}`);
    const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1 OR email = $1', [usernameOrEmail]);

    if (user) {
      console.log(`User found: ${usernameOrEmail}, verifying password`);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        console.log('Login successful');
        // Login successful, implement your logic here (e.g., token generation, sessions)
        res.status(200).send('Login successful');
      } else {
        console.log('Invalid password');
        // Invalid credentials
        res.status(401).send('Invalid credentials');
      }
    } else {
      console.log(`User not found: ${usernameOrEmail}`);
      res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal server error');
    console.error(`Error response sent for login request: ${JSON.stringify(error)}`);
  }
});

module.exports = router;
