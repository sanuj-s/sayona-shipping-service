// ─────────────────────────────────────────────
// Request Timeout Middleware
// Returns 503 if a request handler exceeds the
// configured timeout, preventing resource exhaustion
// ─────────────────────────────────────────────

const TIMEOUT_MS = parseInt(process.env.REQUEST_TIMEOUT_MS, 10) || 30000;

const timeout = (req, res, next) => {
    const timer = setTimeout(() => {
        if (!res.headersSent) {
            res.status(503).json({
                success: false,
                error: {
                    code: 'ERR_TIMEOUT',
                    message: 'Request timed out',
                },
            });
        }
    }, TIMEOUT_MS);

    // Clear timeout when response finishes
    res.on('finish', () => clearTimeout(timer));
    res.on('close', () => clearTimeout(timer));

    next();
};

module.exports = timeout;
