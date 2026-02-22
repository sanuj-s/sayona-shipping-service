// ─────────────────────────────────────────────
// Audit Logger Middleware — Records state-changing operations
// ─────────────────────────────────────────────
const { query } = require('../config/database');
const logger = require('../config/logger');

/**
 * Log an audit event to the audit_logs table
 * @param {object} params
 * @param {number} params.userId - User performing the action
 * @param {string} params.action - Action type (from AUDIT_ACTIONS)
 * @param {string} params.entityType - Entity type (user, shipment, etc.)
 * @param {number} params.entityId - Entity ID
 * @param {object} params.oldValues - Previous values (for updates)
 * @param {object} params.newValues - New values
 * @param {string} params.ipAddress - Client IP
 * @param {string} params.userAgent - Client user agent
 */
const logAudit = async ({ userId, action, entityType, entityId, oldValues, newValues, ipAddress, userAgent }) => {
    try {
        await query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
                userId || null,
                action,
                entityType,
                entityId || null,
                oldValues ? JSON.stringify(oldValues) : null,
                newValues ? JSON.stringify(newValues) : null,
                ipAddress || null,
                userAgent || null,
            ]
        );
    } catch (error) {
        // Audit logging failure should not break the request
        logger.error('Failed to write audit log', {
            error: error.message,
            action,
            entityType,
            entityId,
        });
    }
};

/**
 * Express middleware to attach audit helper to request
 */
const auditMiddleware = (req, res, next) => {
    req.audit = (action, entityType, entityId, oldValues = null, newValues = null) => {
        return logAudit({
            userId: req.user ? req.user.id : null,
            action,
            entityType,
            entityId,
            oldValues,
            newValues,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
        });
    };
    next();
};

module.exports = { logAudit, auditMiddleware };
