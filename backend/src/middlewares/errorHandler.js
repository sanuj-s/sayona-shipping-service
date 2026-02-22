// ─────────────────────────────────────────────
// Error Handler Middleware — Centralized error management
// No stack traces in production, structured error responses
// ─────────────────────────────────────────────
const logger = require('../config/logger');
const config = require('../config/environment');
const { AppError, ValidationError } = require('../utils/AppError');

/**
 * Global error handler
 */
const errorHandler = (err, req, res, _next) => {
    // Log error with context
    const logMeta = {
        correlationId: req.correlationId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: req.user ? req.user.id : null,
    };

    if (err instanceof AppError && err.isOperational) {
        // Operational errors — expected, logged as warnings
        logger.warn(err.message, { ...logMeta, errorCode: err.errorCode, statusCode: err.statusCode });
    } else {
        // Programming errors — unexpected, logged as errors with stack
        logger.error(err.message, { ...logMeta, stack: err.stack });
    }

    // Determine response
    let statusCode = err.statusCode || 500;
    let errorCode = err.errorCode || 'ERR_INTERNAL';
    let message = err.message || 'Internal Server Error';
    let details = null;

    // Handle Joi/Validation errors
    if (err instanceof ValidationError) {
        details = err.details;
    }

    // PostgreSQL unique constraint violation
    if (err.code === '23505') {
        statusCode = 409;
        errorCode = 'ERR_CONFLICT';
        message = 'A record with this value already exists';
    }

    // PostgreSQL foreign key violation
    if (err.code === '23503') {
        statusCode = 400;
        errorCode = 'ERR_FOREIGN_KEY';
        message = 'Referenced record does not exist';
    }

    // Never expose stack traces in production
    const response = {
        success: false,
        error: {
            code: errorCode,
            message: config.isProduction() && statusCode === 500
                ? 'An unexpected error occurred'
                : message,
        },
    };

    if (details) {
        response.error.details = details;
    }

    // Include stack trace in development only
    if (config.isDevelopment()) {
        response.error.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

/**
 * 404 handler — catch unmatched routes
 */
const notFound = (req, res, next) => {
    const err = new AppError(`Route not found — ${req.method} ${req.originalUrl}`, 404, 'ERR_NOT_FOUND');
    next(err);
};

module.exports = { errorHandler, notFound };
