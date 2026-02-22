// ─────────────────────────────────────────────
// Shipment Service — Business logic for shipments
// ─────────────────────────────────────────────
const ShipmentRepository = require('../repositories/shipment.repository');
const TrackingRepository = require('../repositories/tracking.repository');
const { NotFoundError, ConflictError, ValidationError } = require('../utils/AppError');
const { SHIPMENT_STATUS, SHIPMENT_STATUS_TRANSITIONS } = require('../models/schemas');

/**
 * Map DB row to API response (no internal IDs exposed)
 */
const mapShipment = (row) => ({
    uuid: row.uuid,
    trackingNumber: row.tracking_number,
    senderName: row.sender_name,
    receiverName: row.receiver_name,
    origin: row.origin,
    destination: row.destination,
    status: row.status,
    industryType: row.industry_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: row.version,
});

const ShipmentService = {
    /**
     * Create a shipment + initial tracking event
     */
    create: async ({ trackingNumber, userId, senderName, receiverName, origin, destination, industryType, currentLocation, createdBy }) => {
        if (await ShipmentRepository.trackingNumberExists(trackingNumber)) {
            throw new ConflictError('A shipment with this tracking number already exists');
        }

        const shipment = await ShipmentRepository.create({
            trackingNumber, userId, senderName, receiverName, origin, destination, industryType, createdBy,
        });

        // Create initial tracking event
        await TrackingRepository.create({
            shipmentId: shipment.id,
            trackingNumber,
            location: currentLocation || origin,
            status: SHIPMENT_STATUS.CREATED,
            description: 'Shipment created',
            createdBy,
        });

        return { ...mapShipment(shipment), currentLocation: currentLocation || origin };
    },

    /**
     * Get all shipments (paginated, filtered)
     */
    getAll: async (pagination, filters) => {
        const [rows, total] = await Promise.all([
            ShipmentRepository.findAll({ ...pagination, filters }),
            ShipmentRepository.countAll(filters),
        ]);
        return { data: rows.map(mapShipment), total };
    },

    /**
     * Get shipments for a specific user
     */
    getByUserId: async (userId, pagination) => {
        const [rows, total] = await Promise.all([
            ShipmentRepository.findByUserId(userId, pagination),
            ShipmentRepository.countByUserId(userId),
        ]);
        return { data: rows.map(mapShipment), total };
    },

    /**
     * Get one shipment by UUID
     */
    getByUuid: async (uuid) => {
        const shipment = await ShipmentRepository.findByUuid(uuid);
        if (!shipment) throw new NotFoundError('Shipment');

        const currentLocation = await TrackingRepository.getLatestLocation(shipment.tracking_number);
        return { ...mapShipment(shipment), currentLocation };
    },

    /**
     * Get one shipment by tracking number
     */
    getByTrackingNumber: async (trackingNumber) => {
        const shipment = await ShipmentRepository.findByTrackingNumber(trackingNumber);
        if (!shipment) throw new NotFoundError('Shipment');

        const currentLocation = await TrackingRepository.getLatestLocation(trackingNumber);
        return { ...mapShipment(shipment), currentLocation };
    },

    /**
     * Update shipment status with lifecycle enforcement
     */
    updateStatus: async (uuid, { status, currentLocation, description }, userId) => {
        const shipment = await ShipmentRepository.findByUuid(uuid);
        if (!shipment) throw new NotFoundError('Shipment');

        // Validate status transition
        if (status) {
            const allowed = SHIPMENT_STATUS_TRANSITIONS[shipment.status];
            if (!allowed || !allowed.includes(status)) {
                throw new ValidationError(
                    `Cannot transition from ${shipment.status} to ${status}. Allowed: ${(allowed || []).join(', ') || 'none'}`
                );
            }
        }

        const newStatus = status || shipment.status;

        // Update shipment
        const updated = await ShipmentRepository.updateStatus(shipment.id, newStatus);
        if (!updated) throw new ConflictError('Shipment was modified by another request');

        // Add tracking event
        if (status || currentLocation) {
            await TrackingRepository.create({
                shipmentId: shipment.id,
                trackingNumber: shipment.tracking_number,
                location: currentLocation || 'Unknown',
                status: newStatus,
                description: description || `Status updated to ${newStatus}`,
                createdBy: userId,
            });
        }

        return { message: 'Shipment updated', shipment: mapShipment(updated) };
    },

    /**
     * Soft delete a shipment
     */
    softDelete: async (uuid) => {
        const shipment = await ShipmentRepository.findByUuid(uuid);
        if (!shipment) throw new NotFoundError('Shipment');

        await ShipmentRepository.softDelete(shipment.id);
        return { message: 'Shipment deleted' };
    },

    /**
     * Dashboard analytics
     */
    getAnalytics: async () => {
        const [totalShipments, statusCounts, recentShipments] = await Promise.all([
            ShipmentRepository.countAll(),
            ShipmentRepository.countByStatus(),
            ShipmentRepository.findRecent(10),
        ]);

        return {
            totalShipments,
            statusCounts,
            recentShipments: recentShipments.map(mapShipment),
        };
    },
};

module.exports = ShipmentService;
