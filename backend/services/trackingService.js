// ─────────────────────────────────────────────
// Tracking Service — Business logic for tracking
// ─────────────────────────────────────────────
const Shipment = require('../models/Shipment');
const Tracking = require('../models/Tracking');

const TrackingService = {
    // Get tracking history + shipment info
    getHistory: async (trackingNumber) => {
        const shipment = await Shipment.findByTrackingId(trackingNumber);
        if (!shipment) {
            throw Object.assign(new Error('Tracking number not found'), { statusCode: 404 });
        }

        const history = await Tracking.findByTrackingId(trackingNumber);
        const currentLocation = history.length > 0 ? history[0].location : 'Unknown';

        return {
            shipment: {
                trackingNumber: shipment.tracking_id,
                senderName: shipment.sender_name,
                receiverName: shipment.receiver_name,
                status: shipment.status,
                currentLocation,
            },
            history,
        };
    },

    // Add a tracking event
    addEvent: async ({ trackingNumber, location, status }) => {
        const exists = await Shipment.trackingExists(trackingNumber);
        if (!exists) {
            throw Object.assign(new Error('Shipment not found'), { statusCode: 404 });
        }

        await Shipment.updateStatus(trackingNumber, status);
        const event = await Tracking.create({ trackingId: trackingNumber, location, status });
        return event;
    },
};

module.exports = TrackingService;
