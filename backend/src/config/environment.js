// ─────────────────────────────────────────────
// Environment Configuration — Centralized env loading
// Validates all required variables at startup
// ─────────────────────────────────────────────
const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

// Allow either DATABASE_URL or individual DB components
const hasDbUrl = !!process.env.DATABASE_URL;
const requiredVars = hasDbUrl
    ? ['JWT_SECRET', 'JWT_REFRESH_SECRET']
    : ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

// Strict production sanity checks
if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET.length < 32 || process.env.JWT_REFRESH_SECRET.length < 32) {
        console.error('❌ CRITICAL: JWT secrets must be at least 32 characters in production.');
        process.exit(1);
    }
    if (process.env.DB_PASSWORD === 'changeme' || process.env.DB_PASSWORD === 'test') {
        console.error('❌ CRITICAL: Insecure database password detected in production.');
        process.exit(1);
    }
}

const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,

    db: {
        url: process.env.DATABASE_URL,
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        name: process.env.DB_NAME,
        poolMax: parseInt(process.env.DB_POOL_MAX, 10) || 20,
        idleTimeoutMs: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,
        connectionTimeoutMs: parseInt(process.env.DB_CONN_TIMEOUT, 10) || 5000,
        ssl: process.env.NODE_ENV === 'production' || process.env.DB_SSL === 'true',
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    },

    cors: {
        origins: process.env.CORS_ORIGINS
            ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
            : ['http://localhost:3000'],
    },

    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
        authMax: parseInt(process.env.RATE_LIMIT_AUTH_MAX, 10) || 10,
        formMax: parseInt(process.env.RATE_LIMIT_FORM_MAX, 10) || 5,
    },

    security: {
        saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12,
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5,
        lockDurationMs: parseInt(process.env.LOCK_DURATION_MS, 10) || 30 * 60 * 1000,
        bodyLimit: process.env.BODY_LIMIT || '1mb',
    },

    log: {
        level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        dir: process.env.LOG_DIR || path.resolve(__dirname, '..', '..', 'logs'),
    },

    isProduction: () => config.nodeEnv === 'production',
    isDevelopment: () => config.nodeEnv === 'development',
};

module.exports = config;
