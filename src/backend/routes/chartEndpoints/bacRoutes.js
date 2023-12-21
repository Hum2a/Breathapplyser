// backend/routes/bacRoutes.js

const express = require('express');
const router = express.Router();
const { db } = require('../../database/db');

router.get('/api/bacData/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await db.any('SELECT * FROM bac_data WHERE user_id = $1 ORDER BY timestamp', [userId]);
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching BAC data');
  }
});

module.exports = router;
