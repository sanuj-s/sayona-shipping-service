// ─────────────────────────────────────────────
// Tracking Validators — Joi schemas
// ─────────────────────────────────────────────
const Joi = require('joi');
const { SHIPMENT_STATUS_VALUES } = require('../models/schemas');

const addEvent = {
    body: Joi.object({
        trackingNumber: Joi.string().trim().max(50).required(),
        location: Joi.string().trim().max(200).required(),
        status: Joi.string().valid(...SHIPMENT_STATUS_VALUES).required(),
        description: Joi.string().trim().max(500),
    }),
};

const trackingParam = {
    params: Joi.object({
        trackingNumber: Joi.string().trim().max(50).required(),
    }),
};

module.exports = { addEvent, trackingParam };
