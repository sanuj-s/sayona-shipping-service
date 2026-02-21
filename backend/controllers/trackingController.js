// ─────────────────────────────────────────────
// Tracking Controller — HTTP handlers for tracking
// Uses: TrackingService → Shipment/Tracking Models → DB
// ─────────────────────────────────────────────
const TrackingService = require('../services/trackingService');

// @desc    Get tracking history and shipment info
// @route   GET /api/tracking/:trackingNumber
// @access  Public
const getTracking = async (req, res) => {
    try {
        const data = await TrackingService.getHistory(req.params.trackingNumber);
        res.status(200).json(data);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc    Add a tracking update event
// @route   POST /api/tracking
// @access  Private
const updateTracking = async (req, res) => {
    try {
        const { trackingNumber, location, status, description } = req.body;

        if (!trackingNumber || !location || !status) {
            return res.status(400).json({ message: 'trackingNumber, location, and status are required' });
        }

        const event = await TrackingService.addEvent({ trackingNumber, location, status, description });
        res.status(201).json(event);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

module.exports = { getTracking, updateTracking };
