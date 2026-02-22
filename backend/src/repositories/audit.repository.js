// ─────────────────────────────────────────────
// Audit Repository — DB abstraction for audit_logs table
// ─────────────────────────────────────────────
const { query } = require('../config/database');

const AuditRepository = {
    /**
     * Create an audit log entry
     */
    create: async ({ userId, action, entityType, entityId, oldValues, newValues, ipAddress, userAgent }) => {
        const result = await query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING id, uuid, created_at`,
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
        return result.rows[0];
    },

    /**
     * Find all audit logs (paginated, filtered)
     */
    findAll: async ({ limit, offset, sortBy = 'created_at', sortOrder = 'DESC', filters = {} }) => {
        let paramIndex = 1;
        const conditions = [];
        const params = [];

        if (filters.userId) {
            conditions.push(`user_id = $${paramIndex++}`);
            params.push(filters.userId);
        }
        if (filters.action) {
            conditions.push(`action = $${paramIndex++}`);
            params.push(filters.action);
        }
        if (filters.entityType) {
            conditions.push(`entity_type = $${paramIndex++}`);
            params.push(filters.entityType);
        }
        if (filters.entityId) {
            conditions.push(`entity_id = $${paramIndex++}`);
            params.push(filters.entityId);
        }
        if (filters.startDate) {
            conditions.push(`created_at >= $${paramIndex++}`);
            params.push(filters.startDate);
        }
        if (filters.endDate) {
            conditions.push(`created_at <= $${paramIndex++}`);
            params.push(filters.endDate);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const result = await query(
            `SELECT al.*, u.name as user_name, u.email as user_email
             FROM audit_logs al
             LEFT JOIN users u ON al.user_id = u.id
             ${whereClause}
             ORDER BY al.${sortBy} ${sortOrder} LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
            [...params, limit, offset]
        );
        return result.rows;
    },

    /**
     * Count audit logs (with filters)
     */
    countAll: async (filters = {}) => {
        let paramIndex = 1;
        const conditions = [];
        const params = [];

        if (filters.userId) {
            conditions.push(`user_id = $${paramIndex++}`);
            params.push(filters.userId);
        }
        if (filters.action) {
            conditions.push(`action = $${paramIndex++}`);
            params.push(filters.action);
        }
        if (filters.entityType) {
            conditions.push(`entity_type = $${paramIndex++}`);
            params.push(filters.entityType);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const result = await query(
            `SELECT COUNT(*) as count FROM audit_logs ${whereClause}`,
            params
        );
        return parseInt(result.rows[0].count, 10);
    },
};

module.exports = AuditRepository;
