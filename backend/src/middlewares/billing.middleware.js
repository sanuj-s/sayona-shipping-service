// ─────────────────────────────────────────────
// Billing Middleware — Enforces SaaS plan limits
// Uses explicit transactions with SELECT ... FOR UPDATE
// and atomic counter increment to prevent race conditions
// ─────────────────────────────────────────────
const { pool, tenantStorage } = require('../config/database');
const { ForbiddenError, NotFoundError } = require('../utils/AppError');

/**
 * Ensures the tenant has not exceeded their shipment limit before allowing creation.
 * Uses a dedicated pool client with an explicit transaction so the FOR UPDATE lock
 * spans through the atomic shipment_count increment.
 */
const checkShipmentLimit = async (req, res, next) => {
    let client;
    try {
        const tenantId = tenantStorage.getStore();
        if (!tenantId) {
            return next(new ForbiddenError('Tenant context missing'));
        }

        client = await pool.connect();
        await client.query('BEGIN');
        await client.query(`SET LOCAL app.current_tenant = '${tenantId}'`);

        // Lock the tenant row to prevent concurrent limit bypasses
        const result = await client.query(
            `SELECT t.shipment_count, p.shipment_limit 
             FROM tenants t
             JOIN plans p ON t.plan_id = p.id
             WHERE t.id = $1 
             FOR UPDATE`,
            [tenantId]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            client.release();
            client = null;
            throw new NotFoundError('Tenant or Plan not found');
        }

        const { shipment_count, shipment_limit } = result.rows[0];

        // -1 represents unlimited
        if (shipment_limit !== -1 && shipment_count >= shipment_limit) {
            await client.query('ROLLBACK');
            client.release();
            client = null;
            return next(new ForbiddenError(`Plan limit reached: You cannot create more than ${shipment_limit} shipments on your current plan. Please upgrade.`));
        }

        // Atomically increment the count while we hold the row lock
        await client.query(
            'UPDATE tenants SET shipment_count = shipment_count + 1 WHERE id = $1',
            [tenantId]
        );

        await client.query('COMMIT');
        client.release();
        client = null;

        next();
    } catch (error) {
        if (client) {
            await client.query('ROLLBACK').catch(() => {});
            client.release();
        }
        next(error);
    }
};

/**
 * Ensures the tenant has not exceeded their user limit before allowing invitations.
 * Uses a dedicated pool client with an explicit transaction so the FOR UPDATE lock
 * spans through the atomic user_count increment.
 */
const checkUserLimit = async (req, res, next) => {
    let client;
    try {
        const tenantId = tenantStorage.getStore();
        if (!tenantId) {
            return next(new ForbiddenError('Tenant context missing'));
        }

        client = await pool.connect();
        await client.query('BEGIN');
        await client.query(`SET LOCAL app.current_tenant = '${tenantId}'`);

        // Lock the tenant row to prevent concurrent limit bypasses
        const result = await client.query(
            `SELECT t.user_count, p.user_limit 
             FROM tenants t
             JOIN plans p ON t.plan_id = p.id
             WHERE t.id = $1 
             FOR UPDATE`,
            [tenantId]
        );

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            client.release();
            client = null;
            throw new NotFoundError('Tenant or Plan not found');
        }

        const { user_count, user_limit } = result.rows[0];

        if (user_limit !== -1 && user_count >= user_limit) {
            await client.query('ROLLBACK');
            client.release();
            client = null;
            return next(new ForbiddenError(`Plan limit reached: You cannot have more than ${user_limit} users on your current plan. Please upgrade.`));
        }

        // Atomically increment the count while we hold the row lock
        await client.query(
            'UPDATE tenants SET user_count = user_count + 1 WHERE id = $1',
            [tenantId]
        );

        await client.query('COMMIT');
        client.release();
        client = null;

        next();
    } catch (error) {
        if (client) {
            await client.query('ROLLBACK').catch(() => {});
            client.release();
        }
        next(error);
    }
};

module.exports = {
    checkShipmentLimit,
    checkUserLimit
};
