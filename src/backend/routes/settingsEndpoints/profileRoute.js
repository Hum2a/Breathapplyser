const express = require('express');
const router = express.Router();
const { db } = require('../../database/db');

// POST request to create or update a user profile
router.post('/api/profile', async (req, res) => {
  try {
    console.log('ProfileRoutes.js: Received POST request to /api/profile with body:', req.body);
    const { user_id, height, weight, age, sex, bmi, dateTime } = req.body;

    // Check if the user already has a profile
    const existingProfile = await db.oneOrNone('SELECT * FROM profile WHERE user_id = $1', [user_id]);

    if (existingProfile) {
      // Update existing profile
      console.log(`ProfileRoutes.js: Updating profile for user_id ${user_id}`);
      await db.none(
        'UPDATE profile SET height = $1, weight = $2, age = $3, sex = $4, bmi = $5, updated_at = $6 WHERE user_id = $7',
        [height, weight, age, sex, bmi, dateTime, user_id]
      );
    } else {
      // Create new profile
      console.log(`ProfileRoutes.js: Creating new profile for user_id ${user_id}`);
      await db.none(
        'INSERT INTO profile (user_id, height, weight, age, sex, bmi, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [user_id, height, weight, age, sex, bmi, dateTime]
      );
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('ProfileRoutes.js: Error in POST /api/profile:', error);
    res.status(500).send('Error updating profile');
  }
});

module.exports = router;
