// ─────────────────────────────────────────────
// Rate Limiter Middleware — Multiple tiers
// ─────────────────────────────────────────────
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const config = require('../config/environment');
const { getRedisClient } = require('../config/redis');

// Redis store generator — falls back to in-memory if Redis unavailable
const getStore = (prefix) => {
    const client = getRedisClient();
    if (!client) return undefined; // express-rate-limit uses in-memory by default
    return new RedisStore({
        sendCommand: (...args) => client.sendCommand(args),
        prefix: `rate-limit:${prefix}:`
    });
};

// General API rate limiter
const apiLimiter = rateLimit({
    store: getStore('api'),
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
    store: getStore('auth'),
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
    store: getStore('form'),
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

// Medium limiter for public tracking endpoints to prevent scraping
const trackingLimiter = rateLimit({
    store: getStore('tracking'),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 tracking requests per windowMs
    message: {
        success: false,
        error: {
            code: 'ERR_RATE_LIMIT',
            message: 'Too many tracking requests, please try again later',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, formLimiter, trackingLimiter };
