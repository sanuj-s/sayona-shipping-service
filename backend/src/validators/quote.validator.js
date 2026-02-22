// ─────────────────────────────────────────────
// Quote Validators — Joi schemas
// ─────────────────────────────────────────────
const Joi = require('joi');
const { QUOTE_STATUS_VALUES } = require('../models/schemas');

const submitQuote = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().email().lowercase().trim().required(),
        phone: Joi.string().trim().max(20).allow('', null),
        company: Joi.string().trim().max(150).allow('', null),
        origin: Joi.string().trim().max(200).required(),
        destination: Joi.string().trim().max(200).required(),
        cargoType: Joi.string().trim().max(100).allow('', null),
        weight: Joi.string().trim().max(50).allow('', null),
        message: Joi.string().trim().max(2000).allow('', null),
    }),
};

const updateQuoteStatus = {
    params: Joi.object({
        uuid: Joi.string().uuid().required(),
    }),
    body: Joi.object({
        status: Joi.string().valid(...QUOTE_STATUS_VALUES).required(),
    }),
};

const getQuotes = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        sortBy: Joi.string().valid('created_at', 'status').default('created_at'),
        sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
        status: Joi.string().valid(...QUOTE_STATUS_VALUES),
    }),
};

module.exports = { submitQuote, updateQuoteStatus, getQuotes };
