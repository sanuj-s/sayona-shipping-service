// ─────────────────────────────────────────────
// Contact Validators — Joi schemas
// ─────────────────────────────────────────────
const Joi = require('joi');

const submitContact = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().email().lowercase().trim().required(),
        phone: Joi.string().trim().max(20).allow('', null),
        subject: Joi.string().trim().max(255).allow('', null),
        message: Joi.string().trim().min(10).max(5000).required()
            .messages({ 'string.min': 'Message must be at least 10 characters' }),
    }),
};

const uuidParam = {
    params: Joi.object({
        uuid: Joi.string().uuid().required(),
    }),
};

const getContacts = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        sortBy: Joi.string().valid('created_at').default('created_at'),
        sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
        isRead: Joi.boolean(),
    }),
};

module.exports = { submitContact, uuidParam, getContacts };
