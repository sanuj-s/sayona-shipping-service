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
                origin: shipment.origin,
                destination: shipment.destination,
                status: shipment.status,
                currentLocation,
                createdAt: shipment.created_at,
                updatedAt: shipment.updated_at,
            },
            history: history.map(h => ({
                id: h.id,
                status: h.status,
                location: h.location,
                description: h.description,
                timestamp: h.timestamp,
            })),
        };
    },

    // Add a tracking event
    addEvent: async ({ trackingNumber, location, status, description }) => {
        const exists = await Shipment.trackingExists(trackingNumber);
        if (!exists) {
            throw Object.assign(new Error('Shipment not found'), { statusCode: 404 });
        }

        // Update shipment status
        await Shipment.updateStatus(trackingNumber, status);

        // Create tracking event
        const event = await Tracking.create({ trackingId: trackingNumber, location, status, description });
        return event;
    },
};

module.exports = TrackingService;
