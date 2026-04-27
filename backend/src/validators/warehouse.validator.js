// ─────────────────────────────────────────────
// Warehouse Validator — Joi schemas
// ─────────────────────────────────────────────
const Joi = require('joi');

const createWarehouse = {
    body: Joi.object({
        name: Joi.string().min(2).max(200).required(),
        location: Joi.string().min(2).max(255).required(),
        capacity: Joi.number().integer().min(0).default(0),
    }),
};

const updateWarehouse = {
    params: Joi.object({ uuid: Joi.string().uuid().required() }),
    body: Joi.object({
        name: Joi.string().min(2).max(200),
        location: Joi.string().min(2).max(255),
        capacity: Joi.number().integer().min(0),
    }).min(1),
};

const uuidParam = {
    params: Joi.object({ uuid: Joi.string().uuid().required() }),
};

module.exports = { createWarehouse, updateWarehouse, uuidParam };
