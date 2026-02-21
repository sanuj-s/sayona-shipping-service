// ─────────────────────────────────────────────
// Tracking Model — Database queries for tracking table
// ─────────────────────────────────────────────
const pool = require('../config/db');

const Tracking = {
    // Add a tracking event
    create: async ({ trackingId, location, status }) => {
        const result = await pool.query(
            `INSERT INTO tracking (tracking_id, location, status)
             VALUES ($1, $2, $3) RETURNING *`,
            [trackingId, location, status]
        );
        return result.rows[0];
    },

    // Get tracking history for a shipment (newest first)
    findByTrackingId: async (trackingId) => {
        const result = await pool.query(
            'SELECT * FROM tracking WHERE tracking_id = $1 ORDER BY timestamp DESC',
            [trackingId]
        );
        return result.rows;
    },

    // Get latest location for a shipment
    getLatestLocation: async (trackingId) => {
        const result = await pool.query(
            'SELECT location FROM tracking WHERE tracking_id = $1 ORDER BY timestamp DESC LIMIT 1',
            [trackingId]
        );
        return result.rows.length > 0 ? result.rows[0].location : 'Unknown';
    },
};

module.exports = Tracking;
