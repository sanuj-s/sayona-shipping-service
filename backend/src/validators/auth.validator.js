// ─────────────────────────────────────────────
// Auth Validators — Joi schemas for auth endpoints
// ─────────────────────────────────────────────
const Joi = require('joi');

const register = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100).required()
            .messages({ 'string.min': 'Name must be at least 2 characters' }),
        email: Joi.string().email().lowercase().trim().required(),
        password: Joi.string().min(8).max(128).required()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .messages({
                'string.min': 'Password must be at least 8 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            }),
        phone: Joi.string().trim().max(20).allow('', null),
        company: Joi.string().trim().max(150).allow('', null),
    }),
};

const login = {
    body: Joi.object({
        email: Joi.string().email().lowercase().trim().required(),
        password: Joi.string().required(),
    }),
};

const updateProfile = {
    body: Joi.object({
        name: Joi.string().trim().min(2).max(100),
        phone: Joi.string().trim().max(20).allow('', null),
        company: Joi.string().trim().max(150).allow('', null),
        address: Joi.string().trim().max(500).allow('', null),
    }).min(1).messages({ 'object.min': 'At least one field must be provided' }),
};

const forgotPassword = {
    body: Joi.object({
        email: Joi.string().email().lowercase().trim().required(),
    }),
};

const resetPassword = {
    body: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().min(8).max(128).required()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .messages({
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
            }),
    }),
};

const refreshToken = {
    body: Joi.object({
        refreshToken: Joi.string().required(),
    }),
};

const logout = {
    body: Joi.object({
        refreshToken: Joi.string().required(),
    }),
};

module.exports = {
    register,
    login,
    updateProfile,
    forgotPassword,
    resetPassword,
    refreshToken,
    logout,
};
