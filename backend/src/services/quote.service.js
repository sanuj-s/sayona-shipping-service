// ─────────────────────────────────────────────
// Quote Service — Business logic for quote requests
// ─────────────────────────────────────────────
const QuoteRepository = require('../repositories/quote.repository');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { QUOTE_STATUS_VALUES } = require('../models/schemas');

const QuoteService = {
    /**
     * Submit a quote request
     */
    submit: async (data) => {
        const quote = await QuoteRepository.create(data);
        // STUB: Email notification
        return quote;
    },

    /**
     * Get all quotes (paginated)
     */
    getAll: async (pagination, filters) => {
        const [data, total] = await Promise.all([
            QuoteRepository.findAll({ ...pagination, filters }),
            QuoteRepository.countAll(filters),
        ]);

        return {
            data: data.map((q) => ({
                uuid: q.uuid,
                name: q.name,
                email: q.email,
                phone: q.phone,
                company: q.company,
                origin: q.origin,
                destination: q.destination,
                cargoType: q.cargo_type,
                weight: q.weight,
                message: q.message,
                status: q.status,
                createdAt: q.created_at,
                updatedAt: q.updated_at,
            })),
            total,
        };
    },

    /**
     * Update quote status
     */
    updateStatus: async (uuid, status, reviewerId) => {
        if (!QUOTE_STATUS_VALUES.includes(status)) {
            throw new ValidationError(`Invalid status. Must be one of: ${QUOTE_STATUS_VALUES.join(', ')}`);
        }

        const quote = await QuoteRepository.findByUuid(uuid);
        if (!quote) throw new NotFoundError('Quote');

        const updated = await QuoteRepository.updateStatus(quote.id, status, reviewerId);
        return {
            uuid: updated.uuid,
            status: updated.status,
            updatedAt: updated.updated_at,
        };
    },
};

module.exports = QuoteService;
