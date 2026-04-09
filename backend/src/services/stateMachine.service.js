// ─────────────────────────────────────────────
// State Machine Service — Shipment Lifecycle
// Enforces strict state transitions, rejects
// invalid transitions deterministically, and
// persists transition history for auditability.
// ─────────────────────────────────────────────
const { SHIPMENT_STATUS, SHIPMENT_STATUS_TRANSITIONS } = require('../models/schemas');
const { AppError } = require('../utils/AppError');
const { query } = require('../config/database');

class StateMachineService {

    /**
     * Determine if a transition from current to target status is permitted.
     */
    isValidTransition(currentStatus, targetStatus) {
        if (!currentStatus || !targetStatus) return false;

        const allowedTransitions = SHIPMENT_STATUS_TRANSITIONS[currentStatus];
        if (!allowedTransitions) return false;

        return allowedTransitions.includes(targetStatus);
    }

    /**
     * Validates transition and throws AppError if invalid
     */
    enforceTransition(currentStatus, targetStatus) {
        // First assignment
        if (!currentStatus && targetStatus === SHIPMENT_STATUS.CREATED) {
            return true;
        }

        if (currentStatus === targetStatus) {
            return true; // No-op
        }

        if (!this.isValidTransition(currentStatus, targetStatus)) {
            throw new AppError(
                `Invalid shipment state transition from ${currentStatus} to ${targetStatus}. Allowed states: ${SHIPMENT_STATUS_TRANSITIONS[currentStatus]?.join(', ') || 'None'}`,
                400
            );
        }

        return true;
    }

    /**
     * Record a state transition in the history table for auditability.
     * @param {number} shipmentId - Internal shipment ID
     * @param {string|null} fromStatus - Previous status (null for first assignment)
     * @param {string} toStatus - New status
     * @param {number|null} userId - User who triggered the transition
     * @param {object} metadata - Optional additional context
     */
    async recordTransition(shipmentId, fromStatus, toStatus, userId = null, metadata = {}) {
        try {
            await query(
                `INSERT INTO state_transitions (shipment_id, from_status, to_status, triggered_by, metadata)
                 VALUES ($1, $2, $3, $4, $5)`,
                [shipmentId, fromStatus, toStatus, userId, JSON.stringify(metadata)]
            );

            // Fetch shipment details for notifications
            const { rows } = await query('SELECT * FROM shipments WHERE id = $1', [shipmentId]);
            if (rows.length > 0 && toStatus !== fromStatus) {
                const mapShipment = require('./shipment.service').mapShipment;
                // Avoid circular dependency side-effects if needed, but since it's lazy we are fine
                const notificationService = require('./notification.service');
                const webhookService = require('./webhook.service');

                const trackingEvent = {
                    status: toStatus,
                    location: metadata.currentLocation || 'System Update',
                    created_at: new Date().toISOString()
                };

                // Dispatch natively to all services on transition bounds
                notificationService.sendStatusUpdate(rows[0], trackingEvent);
                webhookService.dispatchShipmentWebhook(rows[0], 'shipment.updated');
            }
        } catch (error) {
            // Log but don't fail the main operation if audit logging fails
            const logger = require('../config/logger');
            logger.error('Failed to record state transition', {
                shipmentId, fromStatus, toStatus, error: error.message,
            });
        }
    }

    /**
     * Get transition history for a shipment
     */
    async getTransitionHistory(shipmentId) {
        const result = await query(
            `SELECT st.*, u.name as triggered_by_name
             FROM state_transitions st
             LEFT JOIN users u ON st.triggered_by = u.id
             WHERE st.shipment_id = $1
             ORDER BY st.created_at ASC`,
            [shipmentId]
        );
        return result.rows;
    }
}

module.exports = new StateMachineService();
