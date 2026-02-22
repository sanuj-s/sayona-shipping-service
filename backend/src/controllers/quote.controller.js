// ─────────────────────────────────────────────
// Quote Controller — HTTP handlers for quotes
// ─────────────────────────────────────────────
const QuoteService = require('../services/quote.service');
const { success, created, paginated } = require('../utils/responseHelper');
const { parsePagination } = require('../utils/pagination');
const { AUDIT_ACTIONS } = require('../models/schemas');

const submitQuote = async (req, res, next) => {
    try {
        const quote = await QuoteService.submit(req.body);

        // Audit log (user might not be authenticated)
        if (req.audit) {
            await req.audit(AUDIT_ACTIONS.QUOTE_SUBMITTED, 'quote', null, null, {
                email: req.body.email,
            });
        }

        return created(res, {
            message: 'Quote request submitted successfully',
            uuid: quote.uuid,
        });
    } catch (error) {
        next(error);
    }
};

const getQuotes = async (req, res, next) => {
    try {
        const pagination = parsePagination(req.query, ['created_at', 'status']);
        const filters = { status: req.query.status };
        const result = await QuoteService.getAll(pagination, filters);

        return paginated(res, result.data, {
            page: pagination.page,
            limit: pagination.limit,
            total: result.total,
        });
    } catch (error) {
        next(error);
    }
};

const updateQuoteStatus = async (req, res, next) => {
    try {
        const result = await QuoteService.updateStatus(
            req.params.uuid,
            req.body.status,
            req.user.id
        );

        await req.audit(AUDIT_ACTIONS.QUOTE_STATUS_UPDATED, 'quote', null, null, {
            uuid: req.params.uuid,
            status: req.body.status,
        });

        return success(res, result);
    } catch (error) {
        next(error);
    }
};

module.exports = { submitQuote, getQuotes, updateQuoteStatus };
