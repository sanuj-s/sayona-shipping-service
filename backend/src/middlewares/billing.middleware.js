// ─────────────────────────────────────────────
// Billing Middleware — Enforces SaaS plan limits
// Protects against race conditions via SELECT ... FOR UPDATE
// ─────────────────────────────────────────────
const { query, tenantStorage } = require('../config/database');
const { ForbiddenError, NotFoundError } = require('../utils/AppError');

/**
 * Ensures the tenant has not exceeded their shipment limit before allowing creation.
 */
const checkShipmentLimit = async (req, res, next) => {
    try {
        const tenantId = tenantStorage.getStore();
        if (!tenantId) {
            return next(new ForbiddenError('Tenant context missing'));
        }

        // Use a transaction and SELECT ... FOR UPDATE to prevent race conditions
        const result = await query(
            `SELECT t.shipment_count, p.shipment_limit 
             FROM tenants t
             JOIN plans p ON t.plan_id = p.id
             WHERE t.id = $1 
             FOR UPDATE`,
            [tenantId]
        );

        if (result.rows.length === 0) {
            throw new NotFoundError('Tenant or Plan not found');
        }

        const { shipment_count, shipment_limit } = result.rows[0];

        // -1 represents unlimited
        if (shipment_limit !== -1 && shipment_count >= shipment_limit) {
            return next(new ForbiddenError(`Plan limit reached: You cannot create more than ${shipment_limit} shipments on your current plan. Please upgrade.`));
        }

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Ensures the tenant has not exceeded their user limit before allowing invitations.
 */
const checkUserLimit = async (req, res, next) => {
    try {
        const tenantId = tenantStorage.getStore();
        if (!tenantId) {
            return next(new ForbiddenError('Tenant context missing'));
        }

        const result = await query(
            `SELECT t.user_count, p.user_limit 
             FROM tenants t
             JOIN plans p ON t.plan_id = p.id
             WHERE t.id = $1 
             FOR UPDATE`,
            [tenantId]
        );

        if (result.rows.length === 0) {
            throw new NotFoundError('Tenant or Plan not found');
        }

        const { user_count, user_limit } = result.rows[0];

        if (user_limit !== -1 && user_count >= user_limit) {
            return next(new ForbiddenError(`Plan limit reached: You cannot have more than ${user_limit} users on your current plan. Please upgrade.`));
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkShipmentLimit,
    checkUserLimit
};
