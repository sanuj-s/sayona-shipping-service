// ─────────────────────────────────────────────
// Contact Repository — DB abstraction for contacts table
// ─────────────────────────────────────────────
const { query } = require('../config/database');

const ContactRepository = {
    /**
     * Create a contact message
     */
    create: async ({ name, email, phone, subject, message }) => {
        const result = await query(
            `INSERT INTO contacts (name, email, phone, subject, message)
             VALUES ($1, $2, $3, $4, $5) RETURNING id, uuid, created_at`,
            [name, email, phone || null, subject || 'General Inquiry', message]
        );
        return result.rows[0];
    },

    /**
     * Find all contacts (paginated)
     */
    findAll: async ({ limit, offset, sortBy, sortOrder, filters = {} }) => {
        let paramIndex = 1;
        const conditions = ['deleted_at IS NULL'];
        const params = [];

        if (filters.isRead !== undefined) {
            conditions.push(`is_read = $${paramIndex++}`);
            params.push(filters.isRead);
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`;
        const result = await query(
            `SELECT * FROM contacts ${whereClause}
             ORDER BY ${sortBy} ${sortOrder} LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            [...params, limit, offset]
        );
        return result.rows;
    },

    /**
     * Count all contacts
     */
    countAll: async (filters = {}) => {
        const conditions = ['deleted_at IS NULL'];
        const params = [];
        let paramIndex = 1;

        if (filters.isRead !== undefined) {
            conditions.push(`is_read = $${paramIndex++}`);
            params.push(filters.isRead);
        }

        const whereClause = `WHERE ${conditions.join(' AND ')}`;
        const result = await query(
            `SELECT COUNT(*) as count FROM contacts ${whereClause}`,
            params
        );
        return parseInt(result.rows[0].count, 10);
    },

    /**
     * Find by UUID
     */
    findByUuid: async (uuid) => {
        const result = await query(
            'SELECT * FROM contacts WHERE uuid = $1 AND deleted_at IS NULL',
            [uuid]
        );
        return result.rows[0] || null;
    },

    /**
     * Mark as read
     */
    markRead: async (id) => {
        const result = await query(
            `UPDATE contacts SET is_read = TRUE WHERE id = $1 AND deleted_at IS NULL RETURNING *`,
            [id]
        );
        return result.rows[0] || null;
    },

    /**
     * Soft delete
     */
    softDelete: async (id) => {
        const result = await query(
            `UPDATE contacts SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL
             RETURNING id, uuid`,
            [id]
        );
        return result.rows[0] || null;
    },
};

module.exports = ContactRepository;
