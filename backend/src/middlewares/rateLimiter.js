// ─────────────────────────────────────────────
// Rate Limiter Middleware — Multiple tiers
// ─────────────────────────────────────────────
const rateLimit = require('express-rate-limit');
const config = require('../config/environment');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: {
        success: false,
        error: {
            code: 'ERR_RATE_LIMIT',
            message: 'Too many requests, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for auth endpoints (login, register, forgot-password)
const authLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.authMax,
    message: {
        success: false,
        error: {
            code: 'ERR_RATE_LIMIT',
            message: 'Too many authentication attempts, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Form submission limiter (contact, quote)
const formLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.formMax,
    message: {
        success: false,
        error: {
            code: 'ERR_RATE_LIMIT',
            message: 'Too many submissions, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, formLimiter };
