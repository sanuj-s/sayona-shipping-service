// ─────────────────────────────────────────────
// Environment Configuration — Centralized env loading
// Validates all variables via Joi schema at startup.
// Rejects startup with clear errors if required vars
// are missing or malformed.
// ─────────────────────────────────────────────
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

// ─────────────── Schema Definition ───────────────
// All env vars declared here with types, defaults, and constraints.
// Required vars have no default; optional vars have defaults.
const envSchema = Joi.object({
    // Server
    NODE_ENV: Joi.string().valid('development', 'staging', 'production', 'test').default('development'),
    PORT: Joi.number().integer().min(1).max(65535).default(3000),
    BASE_URL: Joi.string().uri().optional(),

    // Database — either DATABASE_URL or individual components
    DATABASE_URL: Joi.string().uri().optional(),
    DB_HOST: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.when('NODE_ENV', { is: 'test', then: Joi.optional(), otherwise: Joi.required() }) }),
    DB_PORT: Joi.number().integer().default(5432),
    DB_USER: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.when('NODE_ENV', { is: 'test', then: Joi.optional(), otherwise: Joi.required() }) }),
    DB_PASSWORD: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.when('NODE_ENV', { is: 'test', then: Joi.optional(), otherwise: Joi.required() }) }),
    DB_NAME: Joi.string().when('DATABASE_URL', { is: Joi.exist(), then: Joi.optional(), otherwise: Joi.when('NODE_ENV', { is: 'test', then: Joi.optional(), otherwise: Joi.required() }) }),
    DB_POOL_MAX: Joi.number().integer().min(1).max(100).default(20),
    DB_IDLE_TIMEOUT: Joi.number().integer().default(30000),
    DB_CONN_TIMEOUT: Joi.number().integer().default(5000),
    DB_SSL: Joi.string().valid('true', 'false').default('false'),

    // JWT
    JWT_SECRET: Joi.string().when('NODE_ENV', { is: 'test', then: Joi.optional().default('test-jwt-secret'), otherwise: Joi.string().min(32).required() }),
    JWT_REFRESH_SECRET: Joi.string().when('NODE_ENV', { is: 'test', then: Joi.optional().default('test-refresh-secret'), otherwise: Joi.string().min(32).required() }),
    JWT_ACCESS_EXPIRY: Joi.string().default('15m'),
    JWT_REFRESH_EXPIRY: Joi.string().default('7d'),

    // CORS
    CORS_ORIGINS: Joi.string().default('http://localhost:3000'),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: Joi.number().integer().default(900000),
    RATE_LIMIT_MAX: Joi.number().integer().default(100),
    RATE_LIMIT_AUTH_MAX: Joi.number().integer().default(10),
    RATE_LIMIT_FORM_MAX: Joi.number().integer().default(5),

    // Security
    BCRYPT_SALT_ROUNDS: Joi.number().integer().min(10).max(14).default(12),
    MAX_LOGIN_ATTEMPTS: Joi.number().integer().min(3).max(20).default(5),
    LOCK_DURATION_MS: Joi.number().integer().default(1800000),
    BODY_LIMIT: Joi.string().default('1mb'),

    // Logging
    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'debug').default('debug'),
    LOG_DIR: Joi.string().default(path.resolve(__dirname, '..', '..', 'logs')),

    // Email (optional)
    EMAIL_USER: Joi.string().email().optional().allow(''),
    EMAIL_PASS: Joi.string().optional().allow(''),
    EMAIL_HOST: Joi.string().optional().default('smtp.gmail.com'),
    EMAIL_PORT: Joi.number().integer().optional().default(465),

    // Performance
    REQUEST_TIMEOUT_MS: Joi.number().integer().default(30000),

    // Redis (optional)
    REDIS_HOST: Joi.string().optional(),
    REDIS_PORT: Joi.number().integer().default(6379),
    REDIS_URL: Joi.string().optional(),

    // Seed (optional)
    ADMIN_EMAIL: Joi.string().email().optional().allow(''),
    ADMIN_PASSWORD: Joi.string().optional().allow(''),
    STAFF_EMAIL: Joi.string().email().optional().allow(''),
    STAFF_PASSWORD: Joi.string().optional().allow(''),

    // Tracing (optional)
    ENABLE_TRACING: Joi.string().valid('true', 'false').default('false'),
    JAEGER_ENDPOINT: Joi.string().optional(),

    // Service name (microservice mode)
    SERVICE_NAME: Joi.string().default('monolith'),
}).unknown(true); // Allow other env vars we don't control

// ─────────────── Validate ───────────────
const { error: validationError, value: env } = envSchema.validate(process.env, {
    abortEarly: false,
    stripUnknown: false,
});

if (validationError) {
    const details = validationError.details.map(d => `  ✗ ${d.message}`).join('\n');
    console.error(`❌ Environment validation failed:\n${details}\n💡 Please check your .env file or environment variables.`);
    if (env.NODE_ENV !== 'test') {
        process.exit(1);
    }
}

// Strict production sanity checks
if (env.NODE_ENV === 'production') {
    if (env.DB_PASSWORD === 'changeme' || env.DB_PASSWORD === 'test') {
        console.error('❌ CRITICAL: Insecure database password detected in production.');
        process.exit(1);
    }
}

// ─────────────── Config Object ───────────────
const config = {
    nodeEnv: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    baseUrl: env.BASE_URL || (env.NODE_ENV === 'production'
        ? 'https://sayonashipping.me'
        : `http://localhost:${parseInt(env.PORT, 10)}`),

    db: {
        url: env.DATABASE_URL,
        host: env.DB_HOST || 'localhost',
        port: parseInt(env.DB_PORT, 10),
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        name: env.DB_NAME,
        poolMax: parseInt(env.DB_POOL_MAX, 10),
        idleTimeoutMs: parseInt(env.DB_IDLE_TIMEOUT, 10),
        connectionTimeoutMs: parseInt(env.DB_CONN_TIMEOUT, 10),
        ssl: env.DB_SSL === 'true',
    },

    jwt: {
        secret: env.JWT_SECRET,
        accessExpiry: env.JWT_ACCESS_EXPIRY,
        refreshSecret: env.JWT_REFRESH_SECRET,
        refreshExpiry: env.JWT_REFRESH_EXPIRY,
    },

    cors: {
        origins: env.CORS_ORIGINS
            ? env.CORS_ORIGINS.split(',').map((s) => s.trim())
            : ['http://localhost:3000'],
    },

    rateLimit: {
        windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
        maxRequests: parseInt(env.RATE_LIMIT_MAX, 10),
        authMax: parseInt(env.RATE_LIMIT_AUTH_MAX, 10),
        formMax: parseInt(env.RATE_LIMIT_FORM_MAX, 10),
    },

    security: {
        saltRounds: parseInt(env.BCRYPT_SALT_ROUNDS, 10),
        maxLoginAttempts: parseInt(env.MAX_LOGIN_ATTEMPTS, 10),
        lockDurationMs: parseInt(env.LOCK_DURATION_MS, 10),
        bodyLimit: env.BODY_LIMIT,
    },

    log: {
        level: env.LOG_LEVEL,
        dir: env.LOG_DIR,
    },

    email: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
        host: env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(env.EMAIL_PORT, 10) || 465,
    },

    isProduction: () => config.nodeEnv === 'production',
    isDevelopment: () => config.nodeEnv === 'development',
};

module.exports = config;
