// ─────────────────────────────────────────────
// Shipment Validators — Joi schemas
// ─────────────────────────────────────────────
const Joi = require('joi');
const { SHIPMENT_STATUS_VALUES } = require('../models/schemas');

const createShipment = {
    body: Joi.object({
        trackingNumber: Joi.string().trim().max(50).required(),
        senderName: Joi.string().trim().max(100).required(),
        receiverName: Joi.string().trim().max(100).required(),
        origin: Joi.string().trim().max(200).required(),
        destination: Joi.string().trim().max(200).required(),
        currentLocation: Joi.string().trim().max(200),
        industryType: Joi.string().trim().max(50),
        userEmail: Joi.string().email().lowercase().trim(),
    }),
};

const updateShipment = {
    params: Joi.object({
        uuid: Joi.string().uuid().required(),
    }),
    body: Joi.object({
        status: Joi.string().valid(...SHIPMENT_STATUS_VALUES),
        currentLocation: Joi.string().trim().max(200),
        description: Joi.string().trim().max(500),
    }).min(1).messages({ 'object.min': 'At least one field to update must be provided' }),
};

const getShipments = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        sortBy: Joi.string().valid('created_at', 'updated_at', 'status').default('created_at'),
        sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
        status: Joi.string().valid(...SHIPMENT_STATUS_VALUES),
        industryType: Joi.string().trim().max(50),
        search: Joi.string().trim().max(100),
    }),
};

const uuidParam = {
    params: Joi.object({
        uuid: Joi.string().uuid().required(),
    }),
};

module.exports = {
    createShipment,
    updateShipment,
    getShipments,
    uuidParam,
};
