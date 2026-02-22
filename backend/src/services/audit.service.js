// ─────────────────────────────────────────────
// Audit Service — Business logic for audit log viewing
// ─────────────────────────────────────────────
const AuditRepository = require('../repositories/audit.repository');

const AuditService = {
    /**
     * Get audit logs (paginated, filtered)
     */
    getAll: async (pagination, filters) => {
        const [data, total] = await Promise.all([
            AuditRepository.findAll({ ...pagination, filters }),
            AuditRepository.countAll(filters),
        ]);

        return {
            data: data.map((log) => ({
                uuid: log.uuid,
                userName: log.user_name,
                userEmail: log.user_email,
                action: log.action,
                entityType: log.entity_type,
                entityId: log.entity_id,
                oldValues: log.old_values,
                newValues: log.new_values,
                ipAddress: log.ip_address,
                userAgent: log.user_agent,
                createdAt: log.created_at,
            })),
            total,
        };
    },
};

module.exports = AuditService;
