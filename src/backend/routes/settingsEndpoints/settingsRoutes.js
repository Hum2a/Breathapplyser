const express = require('express');
const router = express.Router();
const { db } = require('../../database/db');

// POST request to update user settings
router.post('/api/settings', async (req, res) => {
  try {
    console.log('SettingsRoutes.js: Received POST request to /api/settings with body:', req.body);
    const { user_id, spendingLimit, drinkingLimit } = req.body;

    // Check if the user already has settings
    const existingSettings = await db.oneOrNone('SELECT * FROM user_settings WHERE user_id = $1', [user_id]);

    if (existingSettings) {
      // Update existing settings
      console.log(`SettingsRoutes.js: Updating settings for user_id ${user_id}`);
      await db.none(
        'UPDATE user_settings SET spending_limit = $1, drinking_limit = $2 WHERE user_id = $3',
        [spendingLimit, drinkingLimit, user_id]
      );
    } else {
      // Create new settings
      console.log(`SettingsRoutes.js: Creating new settings for user_id ${user_id}`);
      await db.none(
        'INSERT INTO user_settings (user_id, spending_limit, drinking_limit) VALUES ($1, $2, $3)',
        [user_id, spendingLimit, drinkingLimit]
      );
    }

    res.status(200).json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('SettingsRoutes.js: Error in POST /api/settings:', error);
    res.status(500).send('Error updating settings');
  }
});

module.exports = router;
