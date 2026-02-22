// ─────────────────────────────────────────────
// Logger — Structured logging with Winston
// Features: log levels, file rotation, JSON format, correlation IDs
// ─────────────────────────────────────────────
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Resolve log directory — avoid circular dependency with environment.js
const LOG_DIR = process.env.LOG_DIR || path.resolve(__dirname, '..', '..', 'logs');
const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp: ts, correlationId, ...meta }) => {
    const corrId = correlationId ? ` [${correlationId}]` : '';
    const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
    return `${ts} ${level}${corrId}: ${message}${metaStr}`;
});

// Create logger
const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        errors({ stack: true }),
    ),
    defaultMeta: {
        service: 'sayona-api',
    },
    transports: [
        // Console transport
        new winston.transports.Console({
            format: combine(
                colorize(),
                consoleFormat,
            ),
        }),

        // Error log file
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'error.log'),
            level: 'error',
            format: json(),
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 5,
            tailable: true,
        }),

        // Combined log file
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'combined.log'),
            format: json(),
            maxsize: 10 * 1024 * 1024, // 10MB
            maxFiles: 10,
            tailable: true,
        }),
    ],
    // Do not exit on uncaught
    exitOnError: false,
});

// Stream for Morgan HTTP logging integration
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

module.exports = logger;
