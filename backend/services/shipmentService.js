// ─────────────────────────────────────────────
// Shipment Service — Business logic for shipments
// ─────────────────────────────────────────────
const Shipment = require('../models/Shipment');
const Tracking = require('../models/Tracking');

// Helper: map DB row to API response
const mapShipment = (row) => ({
    id: row.id,
    trackingNumber: row.tracking_id,
    userId: row.user_id,
    senderName: row.sender_name,
    receiverName: row.receiver_name,
    origin: row.origin,
    destination: row.destination,
    status: row.status,
    industryType: row.industry_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
});

const ShipmentService = {
    // Create a shipment + initial tracking entry
    create: async ({ trackingNumber, senderName, senderAddress, receiverName, receiverAddress, currentLocation, industryType }) => {
        if (await Shipment.trackingExists(trackingNumber)) {
            throw Object.assign(new Error('Shipment with this tracking number already exists'), { statusCode: 400 });
        }

        const shipment = await Shipment.create({
            trackingNumber,
            senderName,
            receiverName,
            origin: senderAddress,
            destination: receiverAddress,
            industryType,
            userId,
        });

        await Tracking.create({
            trackingId: trackingNumber,
            location: currentLocation,
            status: 'Pending',
        });

        return { ...mapShipment(shipment), currentLocation };
    },

    // Get all shipments (optionally filtered by industry)
    getAll: async (industry) => {
        const rows = await Shipment.findAll(industry);
        return rows.map(mapShipment);
    },

    // Get all shipments for a specific user
    getByUserId: async (userId) => {
        const rows = await Shipment.findByUserId(userId);
        return rows.map(mapShipment);
    },

    // Get one shipment by tracking number
    getByTrackingNumber: async (trackingNumber) => {
        const shipment = await Shipment.findByTrackingId(trackingNumber);
        if (!shipment) {
            throw Object.assign(new Error('Shipment not found'), { statusCode: 404 });
        }
        const currentLocation = await Tracking.getLatestLocation(trackingNumber);
        return { ...mapShipment(shipment), currentLocation };
    },

    // Update shipment status + add tracking event
    update: async (trackingNumber, { status, currentLocation }) => {
        const shipment = await Shipment.findByTrackingId(trackingNumber);
        if (!shipment) {
            throw Object.assign(new Error('Shipment not found'), { statusCode: 404 });
        }

        const updateStatus = status || shipment.status;

        if (status) {
            await Shipment.updateStatus(trackingNumber, status);
        }

        if (status || currentLocation) {
            await Tracking.create({
                trackingId: trackingNumber,
                location: currentLocation || 'Unknown',
                status: updateStatus,
            });
        }

        return { message: 'Shipment updated successfully' };
    },

    // Delete a shipment
    delete: async (trackingNumber) => {
        const exists = await Shipment.trackingExists(trackingNumber);
        if (!exists) {
            throw Object.assign(new Error('Shipment not found'), { statusCode: 404 });
        }
        await Shipment.deleteByTrackingId(trackingNumber);
        return { message: 'Shipment removed' };
    },
};

module.exports = ShipmentService;
