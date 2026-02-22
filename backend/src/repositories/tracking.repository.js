// ─────────────────────────────────────────────
// Tracking Repository — DB abstraction for tracking_events table
// ─────────────────────────────────────────────
const { query } = require('../config/database');

const TrackingRepository = {
    /**
     * Create a tracking event
     */
    create: async ({ shipmentId, trackingNumber, location, status, description, createdBy }) => {
        const result = await query(
            `INSERT INTO tracking_events (shipment_id, tracking_number, location, status, description, created_by)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [shipmentId, trackingNumber, location, status, description || null, createdBy || null]
        );
        return result.rows[0];
    },

    /**
     * Find tracking history by tracking number (newest first)
     */
    findByTrackingNumber: async (trackingNumber) => {
        const result = await query(
            'SELECT * FROM tracking_events WHERE tracking_number = $1 ORDER BY created_at DESC',
            [trackingNumber]
        );
        return result.rows;
    },

    /**
     * Find tracking history by shipment ID
     */
    findByShipmentId: async (shipmentId) => {
        const result = await query(
            'SELECT * FROM tracking_events WHERE shipment_id = $1 ORDER BY created_at DESC',
            [shipmentId]
        );
        return result.rows;
    },

    /**
     * Get latest location for a shipment
     */
    getLatestLocation: async (trackingNumber) => {
        const result = await query(
            'SELECT location FROM tracking_events WHERE tracking_number = $1 ORDER BY created_at DESC LIMIT 1',
            [trackingNumber]
        );
        return result.rows.length > 0 ? result.rows[0].location : 'Unknown';
    },
};

module.exports = TrackingRepository;
