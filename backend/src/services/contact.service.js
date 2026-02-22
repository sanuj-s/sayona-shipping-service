// ─────────────────────────────────────────────
// Contact Service — Business logic for contact messages
// ─────────────────────────────────────────────
const ContactRepository = require('../repositories/contact.repository');
const { NotFoundError } = require('../utils/AppError');

const ContactService = {
    /**
     * Submit a contact message
     */
    submit: async (data) => {
        const contact = await ContactRepository.create(data);
        // STUB: Email notification to admin
        return contact;
    },

    /**
     * Get all contacts (paginated)
     */
    getAll: async (pagination, filters) => {
        const [data, total] = await Promise.all([
            ContactRepository.findAll({ ...pagination, filters }),
            ContactRepository.countAll(filters),
        ]);

        return {
            data: data.map((c) => ({
                uuid: c.uuid,
                name: c.name,
                email: c.email,
                phone: c.phone,
                subject: c.subject,
                message: c.message,
                isRead: c.is_read,
                createdAt: c.created_at,
            })),
            total,
        };
    },

    /**
     * Mark contact as read
     */
    markRead: async (uuid) => {
        const contact = await ContactRepository.findByUuid(uuid);
        if (!contact) throw new NotFoundError('Contact message');

        const updated = await ContactRepository.markRead(contact.id);
        return { uuid: updated.uuid, isRead: true };
    },
};

module.exports = ContactService;
