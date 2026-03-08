// ─────────────────────────────────────────────
// Tracking Service — Business logic for tracking events
// ─────────────────────────────────────────────
const ShipmentRepository = require('../repositories/shipment.repository');
const TrackingRepository = require('../repositories/tracking.repository');
const { NotFoundError } = require('../utils/AppError');
const cacheService = require('./cache.service');

const TrackingService = {
    /**
     * Get tracking history + shipment info
     */
    getHistory: async (trackingNumber) => {
        const cacheKey = `tracking_history:${trackingNumber}`;
        const cached = await cacheService.get(cacheKey);
        if (cached) return cached;

        const shipment = await ShipmentRepository.findByTrackingNumber(trackingNumber);
        if (!shipment) throw new NotFoundError('Shipment');

        const history = await TrackingRepository.findByTrackingNumber(trackingNumber);
        const currentLocation = history.length > 0 ? history[0].location : 'Unknown';

        const result = {
            shipment: {
                uuid: shipment.uuid,
                trackingNumber: shipment.tracking_number,
                senderName: shipment.sender_name,
                receiverName: shipment.receiver_name,
                origin: shipment.origin,
                destination: shipment.destination,
                status: shipment.status,
                currentLocation,
                createdAt: shipment.created_at,
                updatedAt: shipment.updated_at,
            },
            history: history.map((h) => ({
                uuid: h.uuid,
                status: h.status,
                location: h.location,
                description: h.description,
                createdAt: h.created_at,
            })),
        };

        // Cache for 10 minutes
        await cacheService.set(cacheKey, result, 600);
        return result;
    },

    /**
     * Add a tracking event
     */
    addEvent: async ({ trackingNumber, location, status, description, userId }) => {
        const shipment = await ShipmentRepository.findByTrackingNumber(trackingNumber);
        if (!shipment) throw new NotFoundError('Shipment');

        // Update shipment status
        await ShipmentRepository.updateStatus(shipment.id, status);

        // Create tracking event
        const event = await TrackingRepository.create({
            shipmentId: shipment.id,
            trackingNumber,
            location,
            status,
            description,
            createdBy: userId,
        });

        // Invalidate tracking cache
        await cacheService.del(`tracking_history:${trackingNumber}`);

        return {
            uuid: event.uuid,
            trackingNumber,
            status: event.status,
            location: event.location,
            description: event.description,
            createdAt: event.created_at,
        };
    },
};

module.exports = TrackingService;
