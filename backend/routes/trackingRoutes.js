const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/:trackingId', async (req, res) => {
    try {
        const trackingId = req.params.trackingId;

        console.log("Tracking request received:", trackingId);

        const result = await pool.query(
            'SELECT tracking_id, location, status, timestamp FROM tracking WHERE tracking_id = $1 ORDER BY timestamp DESC',
            [trackingId]
        );

        console.log("Query result:", result.rows);

        return res.status(200).json(result.rows);

    } catch (error) {
        console.error("Tracking error:", error);
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
