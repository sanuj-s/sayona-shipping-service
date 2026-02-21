const pool = require('../config/db');

// @desc    Get tracking history and shipment info
// @route   GET /api/tracking/:trackingNumber
// @access  Public
const getTracking = async (req, res) => {
    try {
        const trackingNumber = req.params.trackingNumber;

        const shipmentResult = await pool.query('SELECT * FROM shipments WHERE tracking_id = $1', [trackingNumber]);

        if (shipmentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Tracking number not found' });
        }

        const shipmentData = shipmentResult.rows[0];

        const historyResult = await pool.query('SELECT * FROM tracking WHERE tracking_id = $1 ORDER BY timestamp DESC', [trackingNumber]);
        const history = historyResult.rows;

        // Deduced current location since tracking_id matches
        const currentLocation = history.length > 0 ? history[0].location : 'Unknown';

        res.status(200).json({
            shipment: {
                trackingNumber: shipmentData.tracking_id,
                senderName: shipmentData.sender_name,
                receiverName: shipmentData.receiver_name,
                status: shipmentData.status,
                currentLocation
            },
            history
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a tracking update manually (if needed outside of shipment update)
// @route   POST /api/tracking/update
// @access  Private
const updateTracking = async (req, res) => {
    try {
        const { trackingNumber, location, status } = req.body;

        if (!trackingNumber || !location || !status) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const shipmentCheck = await pool.query('SELECT * FROM shipments WHERE tracking_id = $1', [trackingNumber]);
        if (shipmentCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Update shipment status in shipments table
        await pool.query('UPDATE shipments SET status = $1 WHERE tracking_id = $2', [status, trackingNumber]);

        const trackingInsert = `
            INSERT INTO tracking (tracking_id, location, status)
            VALUES ($1, $2, $3) RETURNING *
        `;
        const result = await pool.query(trackingInsert, [trackingNumber, location, status]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTracking,
    updateTracking
};
