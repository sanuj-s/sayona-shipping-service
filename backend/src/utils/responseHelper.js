// ─────────────────────────────────────────────
// Response Helper — Strict Response Contract
// All API responses use a consistent envelope format
// ─────────────────────────────────────────────

/**
 * Send a success response
 * @param {object} res - Express response
 * @param {object} data - Response data
 * @param {number} statusCode - HTTP status (default 200)
 * @param {object} meta - Optional pagination/meta info
 */
const success = (res, data = null, statusCode = 200, meta = null) => {
    const response = {
        success: true,
        data,
    };

    if (meta) {
        response.meta = meta;
    }

    return res.status(statusCode).json(response);
};

/**
 * Send a created response (201)
 */
const created = (res, data = null) => {
    return success(res, data, 201);
};

/**
 * Send a paginated response
 * @param {object} res - Express response
 * @param {Array} data - Items array
 * @param {object} pagination - { page, limit, total }
 */
const paginated = (res, data, pagination) => {
    const { page, limit, total } = pagination;
    const totalPages = Math.ceil(total / limit);

    return success(res, data, 200, {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    });
};

/**
 * Send an error response
 * @param {object} res - Express response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status
 * @param {string} errorCode - Machine-readable error code
 * @param {Array} details - Optional validation details
 */
const error = (res, message, statusCode = 500, errorCode = 'ERR_INTERNAL', details = null) => {
    const response = {
        success: false,
        error: {
            code: errorCode,
            message,
        },
    };

    if (details) {
        response.error.details = details;
    }

    return res.status(statusCode).json(response);
};

module.exports = { success, created, paginated, error };
