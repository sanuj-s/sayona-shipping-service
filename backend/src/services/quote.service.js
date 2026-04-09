// ─────────────────────────────────────────────
// Quote Service — Business logic for quote requests
// ─────────────────────────────────────────────
const QuoteRepository = require('../repositories/quote.repository');
const EmailService = require('./email.service');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { QUOTE_STATUS_VALUES } = require('../models/schemas');

const QuoteService = {
    /**
     * Submit a quote request
     */
    submit: async (data) => {
        const quote = await QuoteRepository.create(data);
        
        // Send email notification (non-blocking: quote is saved regardless)
        try {
            await EmailService.sendQuoteNotification(quote);
        } catch (err) {
            // Log but do NOT crash — quote is already saved in DB
            console.error('📧 Email notification failed:', err.message);
        }

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
     * Calculate an algorithmic estimate based on origin, destination and weight
     */
    calculateEstimate: (origin, destination, weight, cargoType) => {
        // Base rate $100
        let base = 100;
        
        // Weight multiplier
        const parsedWeight = parseFloat(weight);
        if (!isNaN(parsedWeight) && parsedWeight > 0) {
            base += parsedWeight * 2.5; // $2.5 per unit of weight
        }

        // Cargo type multiplier
        if (cargoType && cargoType.toLowerCase().includes('fragile')) {
            base *= 1.5;
        }

        return base.toFixed(2);
    },

    /**
     * Reply to a user's quote with an assigned estimate and email them
     */
    replyToQuote: async (uuid, message, estimatedPrice, adminUser) => {
        const quote = await QuoteRepository.findByUuid(uuid);
        if (!quote) throw new NotFoundError('Quote');

        // Update status to 'quoted'
        const updated = await QuoteRepository.updateStatus(quote.id, 'quoted', adminUser.id);
        
        // Dispatch email to customer with their custom estimated price and message
        await EmailService.transporter?.sendMail({
            from: `"Sayona Shipping" <${require('../config/environment').email.user}>`,
            to: quote.email,
            subject: `Update on your Quote Request (${quote.uuid})`,
            text: `Hello ${quote.name},\n\nWe have reviewed your quote request for shipping from ${quote.origin} to ${quote.destination}.\n\nEstimated Price: $${estimatedPrice}\n\nOur Message:\n${message}\n\nPlease reply to this email to proceed.`
        }).catch(err => console.error('Quote Reply Email error:', err.message));

        return {
            uuid: updated.uuid,
            status: updated.status,
            updatedAt: updated.updated_at,
        };
    },

    /**
     * Update quote status
     */
    updateStatus: async (uuid, status, reviewerId) => {
        const { QUOTE_STATUS_VALUES } = require('../models/schemas');
        const QuoteRepository = require('../repositories/quote.repository');
        const { ValidationError, NotFoundError } = require('../utils/AppError');

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
