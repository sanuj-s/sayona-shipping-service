// ─────────────────────────────────────────────
// Shipment Repository — DB abstraction for shipments table
// ─────────────────────────────────────────────
const { query, getClient } = require('../config/database');

const ShipmentRepository = {
    /**
     * Create a new shipment and its associated packages context
     */
    create: async ({ trackingNumber, userId, senderName, receiverName, origin, destination, industryType, createdBy, shippingType, price, weight, dimensions, packages }) => {
        const client = await getClient();
        try {
            await client.query('BEGIN');

            const result = await client.query(
                `INSERT INTO shipments (tracking_number, user_id, sender_name, receiver_name, origin, destination, industry_type, created_by, shipping_type, price, weight, dimensions)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                 RETURNING *`,
                [trackingNumber, userId || null, senderName, receiverName, origin, destination, industryType || 'General', createdBy || null, shippingType || 'standard', price || 0.00, weight || null, dimensions || null]
            );

            const shipment = result.rows[0];

            // If discrete packages are provided, insert them dimensionally
            if (packages && Array.isArray(packages) && packages.length > 0) {
                for (const pkg of packages) {
                    await client.query(
                        `INSERT INTO packages (shipment_id, weight, height, width, length, fragile)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [shipment.id, pkg.weight, pkg.height, pkg.width, pkg.length, pkg.fragile || false]
                    );
                }
            } else if (weight || dimensions) {
                // Fallback: create a single package representing the whole shipment if legacy payload passed
                let w = 0, h = 0, wd = 0, l = 0;
                if (weight) w = parseFloat(weight) || 0;
                if (dimensions) {
                    const parts = typeof dimensions === 'string' ? dimensions.split('x').map(n => parseFloat(n.trim())) : [];
                    if (parts.length === 3) { l = parts[0] || 0; wd = parts[1] || 0; h = parts[2] || 0; }
                }
                await client.query(
                    `INSERT INTO packages (shipment_id, weight, height, width, length, fragile) VALUES ($1, $2, $3, $4, $5, $6)`,
                    [shipment.id, w, h, wd, l, false]
                );
            }

            await client.query('COMMIT');
            return shipment;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Find by tracking number
     */
    findByTrackingNumber: async (trackingNumber) => {
        const result = await query(
            'SELECT * FROM shipments WHERE tracking_number = $1 AND deleted_at IS NULL',
            [trackingNumber]
        );
        return result.rows[0] || null;
    },

    /**
     * Find by UUID
     */
    findByUuid: async (uuid) => {
        const result = await query(
            'SELECT * FROM shipments WHERE uuid = $1 AND deleted_at IS NULL',
            [uuid]
        );
        return result.rows[0] || null;
    },

    /**
     * Find all (paginated, filtered, sorted)
     */
    findAll: async ({ limit, offset, sortBy, sortOrder, filters = {} }) => {
        let paramIndex = 1;
        const conditions = ['deleted_at IS NULL'];
        const params = [];

        if (filters.status) {
            conditions.push(`status = $${paramIndex++}`);
            params.push(filters.status);
        }
        if (filters.industryType) {
            conditions.push(`industry_type = $${paramIndex++}`);
            params.push(filters.industryType);
        }
        if (filters.userId) {
            conditions.push(`user_id = $${paramIndex++}`);
            params.push(filters.userId);
        }
        if (filters.search) {
            conditions.push(`(tracking_number ILIKE $${paramIndex} OR sender_name ILIKE $${paramIndex} OR receiver_name ILIKE $${paramIndex})`);
            params.push(`%${filters.search}%`);
            paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const result = await query(
            `SELECT * FROM shipments ${whereClause}
             ORDER BY ${sortBy} ${sortOrder} LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            [...params, limit, offset]
        );
        return result.rows;
    },

    /**
     * Count all (with filters)
     */
    countAll: async (filters = {}) => {
        let paramIndex = 1;
        const conditions = ['deleted_at IS NULL'];
        const params = [];

        if (filters.status) {
            conditions.push(`status = $${paramIndex++}`);
            params.push(filters.status);
        }
        if (filters.industryType) {
            conditions.push(`industry_type = $${paramIndex++}`);
            params.push(filters.industryType);
        }
        if (filters.userId) {
            conditions.push(`user_id = $${paramIndex++}`);
            params.push(filters.userId);
        }
        if (filters.search) {
            conditions.push(`(tracking_number ILIKE $${paramIndex} OR sender_name ILIKE $${paramIndex} OR receiver_name ILIKE $${paramIndex})`);
            params.push(`%${filters.search}%`);
            paramIndex++;
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const result = await query(
            `SELECT COUNT(*) as count FROM shipments ${whereClause}`,
            params
        );
        return parseInt(result.rows[0].count, 10);
    },

    /**
     * Find by user ID (paginated)
     */
    findByUserId: async (userId, { limit, offset, sortBy, sortOrder }) => {
        const result = await query(
            `SELECT * FROM shipments WHERE user_id = $1 AND deleted_at IS NULL
             ORDER BY ${sortBy} ${sortOrder} LIMIT $2 OFFSET $3`,
            [userId, limit, offset]
        );
        return result.rows;
    },

    /**
     * Count by user ID
     */
    countByUserId: async (userId) => {
        const result = await query(
            'SELECT COUNT(*) as count FROM shipments WHERE user_id = $1 AND deleted_at IS NULL',
            [userId]
        );
        return parseInt(result.rows[0].count, 10);
    },

    /**
     * Update shipment status (with optimistic locking)
     */
    updateStatus: async (id, status, expectedVersion) => {
        const result = await query(
            `UPDATE shipments SET status = $1 
             WHERE id = $2 AND deleted_at IS NULL AND ($3::integer IS NULL OR version = $3)
             RETURNING *`,
            [status, id, expectedVersion || null]
        );
        return result.rows[0] || null;
    },

    /**
     * Soft delete
     */
    softDelete: async (id) => {
        const result = await query(
            `UPDATE shipments SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL
             RETURNING id, uuid, tracking_number`,
            [id]
        );
        return result.rows[0] || null;
    },

    /**
     * Count by status (for dashboard)
     */
    countByStatus: async () => {
        const result = await query(
            `SELECT status, COUNT(*) as count FROM shipments 
             WHERE deleted_at IS NULL GROUP BY status`
        );
        const counts = {};
        result.rows.forEach((row) => { counts[row.status] = parseInt(row.count, 10); });
        return counts;
    },

    /**
     * Calculate total system revenue (for dashboard)
     */
    calculateTotalRevenue: async () => {
        const result = await query(
            `SELECT SUM(price) as total_revenue FROM shipments 
             WHERE deleted_at IS NULL AND status != 'CANCELLED' AND status != 'RETURNED'`
        );
        return parseFloat(result.rows[0].total_revenue || 0).toFixed(2);
    },

    /**
     * Check if tracking number exists
     */
    trackingNumberExists: async (trackingNumber) => {
        const result = await query(
            'SELECT id FROM shipments WHERE tracking_number = $1',
            [trackingNumber]
        );
        return result.rows.length > 0;
    },

    /**
     * Find recent shipments
     */
    findRecent: async (limit = 10) => {
        const result = await query(
            'SELECT * FROM shipments WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT $1',
            [limit]
        );
        return result.rows;
    },
};

module.exports = ShipmentRepository;
