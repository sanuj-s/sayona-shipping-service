// ─────────────────────────────────────────────
// Carrier Validator — Joi schemas
// ─────────────────────────────────────────────
const Joi = require('joi');

const createCarrier = {
    body: Joi.object({
        name: Joi.string().min(2).max(200).required(),
        serviceType: Joi.string().min(2).max(100).required(),
        contact: Joi.string().allow('', null).max(255),
    }),
};

const updateCarrier = {
    params: Joi.object({ uuid: Joi.string().uuid().required() }),
    body: Joi.object({
        name: Joi.string().min(2).max(200),
        serviceType: Joi.string().min(2).max(100),
        contact: Joi.string().allow('', null).max(255),
    }).min(1),
};

const uuidParam = {
    params: Joi.object({ uuid: Joi.string().uuid().required() }),
};

module.exports = { createCarrier, updateCarrier, uuidParam };
