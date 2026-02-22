// ─────────────────────────────────────────────
// Contact Controller — HTTP handlers for contact messages
// ─────────────────────────────────────────────
const ContactService = require('../services/contact.service');
const { success, created, paginated } = require('../utils/responseHelper');
const { parsePagination } = require('../utils/pagination');
const { AUDIT_ACTIONS } = require('../models/schemas');

const submitContact = async (req, res, next) => {
    try {
        const contact = await ContactService.submit(req.body);

        if (req.audit) {
            await req.audit(AUDIT_ACTIONS.CONTACT_SUBMITTED, 'contact', null, null, {
                email: req.body.email,
            });
        }

        return created(res, {
            message: 'Your message has been sent successfully. We will get back to you soon.',
            uuid: contact.uuid,
        });
    } catch (error) {
        next(error);
    }
};

const getContacts = async (req, res, next) => {
    try {
        const pagination = parsePagination(req.query, ['created_at']);
        const filters = {};
        if (req.query.isRead !== undefined) {
            filters.isRead = req.query.isRead === 'true';
        }
        const result = await ContactService.getAll(pagination, filters);

        return paginated(res, result.data, {
            page: pagination.page,
            limit: pagination.limit,
            total: result.total,
        });
    } catch (error) {
        next(error);
    }
};

const markContactRead = async (req, res, next) => {
    try {
        const result = await ContactService.markRead(req.params.uuid);

        await req.audit(AUDIT_ACTIONS.CONTACT_READ, 'contact', null, null, {
            uuid: req.params.uuid,
        });

        return success(res, result);
    } catch (error) {
        next(error);
    }
};

module.exports = { submitContact, getContacts, markContactRead };
