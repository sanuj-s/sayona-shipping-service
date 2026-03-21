// ─────────────────────────────────────────────
// Input Sanitization Middleware
// Strips HTML tags and control characters from
// req.body, req.query, and req.params to prevent
// stored XSS and log injection attacks
// ─────────────────────────────────────────────

/**
 * Strip HTML tags and dangerous control characters from a string
 */
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
        .replace(/<[^>]*>/g, '')           // Strip HTML tags
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Strip control chars (keep \n \r \t)
        .trim();
};

/**
 * Recursively sanitize all string values in an object or array
 */
const sanitizeValue = (value) => {
    if (typeof value === 'string') {
        return sanitizeString(value);
    }
    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }
    if (value !== null && typeof value === 'object') {
        return sanitizeObject(value);
    }
    return value;
};

/**
 * Sanitize all values in a plain object
 */
const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeValue(value);
    }
    return sanitized;
};

/**
 * Express middleware — sanitizes body, query, and params
 */
const sanitize = (req, _res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
        req.query = sanitizeObject(req.query);
    }
    if (req.params && typeof req.params === 'object') {
        req.params = sanitizeObject(req.params);
    }
    next();
};

module.exports = sanitize;
