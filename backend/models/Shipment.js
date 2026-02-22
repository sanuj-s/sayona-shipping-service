// ─────────────────────────────────────────────
// Shipment Model — Database queries for shipments table
// ─────────────────────────────────────────────
const pool = require('../config/db');

const Shipment = {
    // Create a new shipment
    create: async ({ trackingNumber, senderName, receiverName, origin, destination, industryType, userId }) => {
        const result = await pool.query(
            `INSERT INTO shipments (tracking_id, sender_name, receiver_name, origin, destination, status, industry_type, user_id)
             VALUES ($1, $2, $3, $4, $5, 'Pending', $6, $7) RETURNING *`,
            [trackingNumber, senderName, receiverName, origin, destination, industryType || 'Unspecified', userId || null]
        );
        return result.rows[0];
    },

    // Find shipment by tracking ID
    findByTrackingId: async (trackingId) => {
        const result = await pool.query(
            'SELECT * FROM shipments WHERE tracking_id = $1',
            [trackingId]
        );
        return result.rows[0] || null;
    },

    // Get all shipments (sorted newest first, optional industry filter, hard limit 1000 to prevent DOS)
    findAll: async (industry) => {
        let query = 'SELECT * FROM shipments';
        let params = [];

        if (industry) {
            query += ' WHERE industry_type = $1';
            params.push(industry);
        }

        query += ' ORDER BY created_at DESC LIMIT 1000';
        const result = await pool.query(query, params);
        return result.rows;
    },

    // Get all shipments for a specific user (hard limit 1000)
    findByUserId: async (userId) => {
        const result = await pool.query(
            'SELECT * FROM shipments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1000',
            [userId]
        );
        return result.rows;
    },

    // Update shipment status
    updateStatus: async (trackingId, status) => {
        await pool.query(
            'UPDATE shipments SET status = $1 WHERE tracking_id = $2',
            [status, trackingId]
        );
    },

    // Delete shipment by tracking ID
    deleteByTrackingId: async (trackingId) => {
        await pool.query(
            'DELETE FROM shipments WHERE tracking_id = $1',
            [trackingId]
        );
    },

    // Check if tracking ID exists
    trackingExists: async (trackingId) => {
        const result = await pool.query(
            'SELECT id FROM shipments WHERE tracking_id = $1',
            [trackingId]
        );
        return result.rows.length > 0;
    },

    // Count shipments by status
    countByStatus: async () => {
        const result = await pool.query(
            'SELECT status, COUNT(*) as count FROM shipments GROUP BY status'
        );
        const counts = {};
        result.rows.forEach(row => { counts[row.status] = parseInt(row.count); });
        return counts;
    },

    // Get total count
    countAll: async () => {
        const result = await pool.query('SELECT COUNT(*) as count FROM shipments');
        return parseInt(result.rows[0].count);
    },

    // Get recent shipments
    findRecent: async (limit = 10) => {
        const result = await pool.query(
            'SELECT * FROM shipments ORDER BY created_at DESC LIMIT $1',
            [limit]
        );
        return result.rows;
    },
};

module.exports = Shipment;
