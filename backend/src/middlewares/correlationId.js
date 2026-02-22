// ─────────────────────────────────────────────
// Correlation ID Middleware — Request tracing
// Generates a unique ID per request for log correlation
// ─────────────────────────────────────────────
const crypto = require('crypto');

const correlationId = (req, res, next) => {
    const id = req.headers['x-correlation-id'] || crypto.randomUUID();
    req.correlationId = id;
    res.setHeader('X-Correlation-ID', id);
    next();
};

module.exports = correlationId;
