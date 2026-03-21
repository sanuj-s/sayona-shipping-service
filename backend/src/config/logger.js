// ─────────────────────────────────────────────
// Logger — Unified structured logging with Winston
// Single logger instance for the entire codebase.
// All transports use JSON format; console is colorized
// in development only for readability.
// ─────────────────────────────────────────────
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Resolve log directory — avoid circular dependency with environment.js
const LOG_DIR = process.env.LOG_DIR || path.resolve(__dirname, '..', '..', 'logs');
const LOG_LEVEL = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Structured JSON format — used in production and file transports
const structuredFormat = combine(
    timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
    errors({ stack: true }),
    json(),
);

// Human-readable format — development console only
const devConsoleFormat = combine(
    colorize(),
    timestamp({ format: 'HH:mm:ss.SSS' }),
    printf(({ level, message, timestamp: ts, correlationId, ...meta }) => {
        const corrId = correlationId ? ` [${correlationId}]` : '';
        const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
        return `${ts} ${level}${corrId}: ${message}${metaStr}`;
    }),
);

// Build transports
const transports = [
    // Console — JSON in production, colorized in development
    new winston.transports.Console({
        format: IS_PRODUCTION ? structuredFormat : devConsoleFormat,
    }),

    // Error log file — always JSON
    new winston.transports.File({
        filename: path.join(LOG_DIR, 'error.log'),
        level: 'error',
        format: structuredFormat,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
        tailable: true,
    }),

    // Combined log file — always JSON
    new winston.transports.File({
        filename: path.join(LOG_DIR, 'combined.log'),
        format: structuredFormat,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 10,
        tailable: true,
    }),
];

// Create logger
const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: combine(
        timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        errors({ stack: true }),
    ),
    defaultMeta: {
        service: 'sayona-api',
    },
    transports,
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
