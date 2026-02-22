// ─────────────────────────────────────────────
// Shipment Repository — DB abstraction for shipments table
// ─────────────────────────────────────────────
const { query } = require('../config/database');

const ShipmentRepository = {
    /**
     * Create a new shipment
     */
    create: async ({ trackingNumber, userId, senderName, receiverName, origin, destination, industryType, createdBy }) => {
        const result = await query(
            `INSERT INTO shipments (tracking_number, user_id, sender_name, receiver_name, origin, destination, industry_type, created_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [trackingNumber, userId || null, senderName, receiverName, origin, destination, industryType || 'General', createdBy || null]
        );
        return result.rows[0];
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
