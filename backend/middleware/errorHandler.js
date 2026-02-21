// Global error handler middleware

const errorHandler = (err, req, res, next) => {
    // Log error
    console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // Determine status code
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

// 404 handler — catch all unmatched routes
const notFound = (req, res, next) => {
    const error = new Error(`Not Found — ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports = { errorHandler, notFound };
