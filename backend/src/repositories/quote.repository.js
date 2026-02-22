// ─────────────────────────────────────────────
// Quote Repository — DB abstraction for quotes table
// ─────────────────────────────────────────────
const { query } = require('../config/database');

const QuoteRepository = {
    /**
     * Create a quote request
     */
    create: async ({ name, email, phone, company, origin, destination, cargoType, weight, message }) => {
        const result = await query(
            `INSERT INTO quotes (name, email, phone, company, origin, destination, cargo_type, weight, message)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, uuid, created_at`,
            [name, email, phone || null, company || null, origin, destination, cargoType || null, weight || null, message || null]
        );
        return result.rows[0];
    },

    /**
     * Find all quotes (paginated)
     */
    findAll: async ({ limit, offset, sortBy, sortOrder, filters = {} }) => {
        let paramIndex = 1;
        const conditions = ['deleted_at IS NULL'];
        const params = [];

        if (filters.status) {
            conditions.push(`status = $${paramIndex++}`);
            params.push(filters.status);
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`;
        const result = await query(
            `SELECT * FROM quotes ${whereClause}
             ORDER BY ${sortBy} ${sortOrder} LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            [...params, limit, offset]
        );
        return result.rows;
    },

    /**
     * Count all quotes
     */
    countAll: async (filters = {}) => {
        const conditions = ['deleted_at IS NULL'];
        const params = [];
        let paramIndex = 1;

        if (filters.status) {
            conditions.push(`status = $${paramIndex++}`);
            params.push(filters.status);
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`;
        const result = await query(
            `SELECT COUNT(*) as count FROM quotes ${whereClause}`,
            params
        );
        return parseInt(result.rows[0].count, 10);
    },

    /**
     * Find by UUID
     */
    findByUuid: async (uuid) => {
        const result = await query(
            'SELECT * FROM quotes WHERE uuid = $1 AND deleted_at IS NULL',
            [uuid]
        );
        return result.rows[0] || null;
    },

    /**
     * Update quote status
     */
    updateStatus: async (id, status, reviewedBy) => {
        const result = await query(
            `UPDATE quotes SET status = $1, reviewed_by = $2 
             WHERE id = $3 AND deleted_at IS NULL RETURNING *`,
            [status, reviewedBy || null, id]
        );
        return result.rows[0] || null;
    },

    /**
     * Soft delete
     */
    softDelete: async (id) => {
        const result = await query(
            `UPDATE quotes SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL
             RETURNING id, uuid`,
            [id]
        );
        return result.rows[0] || null;
    },
};

module.exports = QuoteRepository;
