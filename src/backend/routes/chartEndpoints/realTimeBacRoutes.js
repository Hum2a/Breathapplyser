const express = require('express');
const router = express.Router();
const { db } = require('../../database/db');

router.get('/api/realTimeBACData/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await db.any('SELECT * FROM real_time_bac_data WHERE user_id = $1 ORDER BY timestamp', [userId]);
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching real-time BAC data');
  }
});

module.exports = router;
