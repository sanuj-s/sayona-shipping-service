// ─────────────────────────────────────────────
// Access Logger Middleware — Structured HTTP request logging
// ─────────────────────────────────────────────
const logger = require('../config/logger');

const accessLogger = (req, res, next) => {
    const start = Date.now();

    // Capture on response finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            correlationId: req.correlationId,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            userId: req.user ? req.user.id : null,
            contentLength: res.get('Content-Length') || 0,
        };

        if (res.statusCode >= 500) {
            logger.error('Request completed with server error', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('Request completed with client error', logData);
        } else {
            logger.http('Request completed', logData);
        }
    });

    next();
};

module.exports = accessLogger;
