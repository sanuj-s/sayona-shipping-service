// ─────────────────────────────────────────────
// Shipment Service — Business logic for shipments
// ─────────────────────────────────────────────
const ShipmentRepository = require('../repositories/shipment.repository');
const TrackingRepository = require('../repositories/tracking.repository');
const { NotFoundError, ConflictError } = require('../utils/AppError');
const { SHIPMENT_STATUS } = require('../models/schemas');

const pricingService = require('./pricing.service');
const routeService = require('./route.service');
const stateMachineService = require('./stateMachine.service');
const notificationService = require('./notification.service');
const webhookService = require('./webhook.service');
const cacheService = require('./cache.service');
const lockService = require('./lock.service');

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
    shippingType: row.shipping_type,
    price: row.price,
    weight: row.weight,
    dimensions: row.dimensions,
    industryType: row.industry_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: row.version,
});

const ShipmentService = {
    /**
     * Create a shipment + initial tracking event
     */
    create: async ({ trackingNumber, userId, senderName, receiverName, origin, destination, industryType, currentLocation, createdBy, shippingType, weight, dimensions }) => {
        if (await ShipmentRepository.trackingNumberExists(trackingNumber)) {
            throw new ConflictError('A shipment with this tracking number already exists');
        }

        // Domain Logic Injection: Calculate Pricing & ETA
        const distanceKm = await routeService.estimateDistance(origin, destination);
        const price = pricingService.calculatePrice({
            weight: weight || 1,
            distance: distanceKm,
            serviceType: shippingType || 'standard'
        });

        const shipment = await ShipmentRepository.create({
            trackingNumber, userId, senderName, receiverName, origin, destination, industryType, createdBy, shippingType, price, weight, dimensions
        });

        // Create initial tracking event
        const trackingEvent = await TrackingRepository.create({
            shipmentId: shipment.id,
            trackingNumber,
            location: currentLocation || origin,
            status: SHIPMENT_STATUS.CREATED,
            description: 'Shipment created and awaiting pickup',
            createdBy,
        });

        // Async Background Triggers
        notificationService.sendStatusUpdate(shipment, trackingEvent);
        webhookService.dispatchShipmentWebhook(shipment, 'shipment.created');

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
     * Update shipment status with lifecycle enforcement and distributed locking
     */
    updateStatus: async (uuid, { status, currentLocation, description }, userId) => {
        let lockToken = null;
        try {
            lockToken = await lockService.acquireLock(`shipment:${uuid}`, 10000);

            const shipment = await ShipmentRepository.findByUuid(uuid);
            if (!shipment) throw new NotFoundError('Shipment');

            // Enforce strict State Machine domain architecture
            if (status) {
                stateMachineService.enforceTransition(shipment.status, status);
            }

            const newStatus = status || shipment.status;

            // Update shipment
            const updated = await ShipmentRepository.updateStatus(shipment.id, newStatus);
            if (!updated) throw new ConflictError('Shipment was modified by another request');

            // Add tracking event and fire notifications
            if (status || currentLocation) {
                const trackingEvent = await TrackingRepository.create({
                    shipmentId: shipment.id,
                    trackingNumber: shipment.tracking_number,
                    location: currentLocation || 'Unknown',
                    status: newStatus,
                    description: description || `Status updated to ${newStatus}`,
                    createdBy: userId,
                });

                // Async Background Triggers
                notificationService.sendStatusUpdate(updated, trackingEvent);
                webhookService.dispatchShipmentWebhook(updated, 'shipment.updated');
            }

            return { message: 'Shipment updated', shipment: mapShipment(updated) };
        } finally {
            if (lockToken) {
                await lockService.releaseLock(`shipment:${uuid}`, lockToken);
            }
        }
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
        const cacheKey = 'dashboard:analytics';
        const cached = await cacheService.get(cacheKey);
        if (cached) return cached;

        const [totalShipments, statusCounts, recentShipments, totalRevenue] = await Promise.all([
            ShipmentRepository.countAll(),
            ShipmentRepository.countByStatus(),
            ShipmentRepository.findRecent(10),
            ShipmentRepository.calculateTotalRevenue(),
        ]);

        const deliveredCount = statusCounts[SHIPMENT_STATUS.DELIVERED] || 0;
        const failedCount = statusCounts[SHIPMENT_STATUS.FAILED_DELIVERY] || 0;
        const terminalCount = deliveredCount + failedCount;

        const deliverySuccessRate = terminalCount > 0
            ? ((deliveredCount / terminalCount) * 100).toFixed(1) + '%'
            : '0.0%';

        const result = {
            totalShipments,
            statusCounts,
            totalRevenue: `$${totalRevenue}`,
            deliverySuccessRate,
            recentShipments: recentShipments.map(mapShipment),
        };

        // Cache dashboard for 5 minutes
        await cacheService.set(cacheKey, result, 300);
        return result;
    },
};

module.exports = ShipmentService;
