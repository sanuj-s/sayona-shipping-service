// ─────────────────────────────────────────────
// Express Application — App setup (no listen)
// Separating app from server enables testing
// ─────────────────────────────────────────────
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');
const compression = require('compression');
const path = require('path');

const config = require('./config/environment');
const corsOptions = require('./config/cors');
const _logger = require('./config/logger');
const { testConnection } = require('./config/database');
const routes = require('./routes');

// Middleware
const correlationId = require('./middlewares/correlationId');
const accessLogger = require('./middlewares/accessLogger');
const { auditMiddleware } = require('./middlewares/auditLogger');
const { apiLimiter } = require('./middlewares/rateLimiter');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

// ─────────────── Security Middleware ───────────────
app.use(helmet({
    contentSecurityPolicy: config.isProduction() ? {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
            imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
            connectSrc: ["'self'", 'https://sayona-shipping-service.onrender.com'],
        }
    } : false,
    crossOriginEmbedderPolicy: false,
    hsts: config.isProduction() ? { maxAge: 31536000, includeSubDomains: true } : false,
}));
app.use(hpp());
app.use(compression());

// ─────────────── Request Processing ───────────────
app.use(correlationId);
app.use(cors(corsOptions));
app.use(express.json({ limit: config.security.bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: config.security.bodyLimit }));
app.use(accessLogger);
app.use(auditMiddleware);

// ─────────────── Rate Limiting ───────────────
app.use('/api', apiLimiter);

// ─────────────── Static Files ───────────────
// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, '..', '..', 'admin')));

// Serve client portal
app.use('/client', express.static(path.join(__dirname, '..', '..', 'client')));

// Serve public assets
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// Serve main website
app.use(express.static(path.join(__dirname, '..', '..'), {
    extensions: ['html'],
    index: 'index.html',
}));

// ─────────────── Health Check ───────────────
app.get('/api/v1/health', async (req, res) => {
    try {
        await testConnection();
        res.json({
            success: true,
            data: {
                status: 'healthy',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
                database: 'connected',
                environment: config.nodeEnv,
                version: require('../../package.json').version || '2.0.0',
            },
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            data: {
                status: 'unhealthy',
                database: 'disconnected',
                message: config.isProduction() ? 'Service unavailable' : error.message,
            },
        });
    }
});

// Legacy health check (backward compat)
app.get('/api/health', (req, res) => {
    res.redirect(301, '/api/v1/health');
});

// ─────────────── API Routes ───────────────
// Log all API requests for production debugging
app.use('/api', (req, res, next) => {
    _logger.info(`[API] ${req.method} ${req.originalUrl}`, { ip: req.ip, correlationId: req.correlationId });
    next();
});
app.use('/api', routes);

// ─────────────── Legacy Route Aliases ───────────────
// Backward compatibility for old frontend endpoints
// These redirect to the new v1 routes
app.post('/api/login', (req, res) => res.redirect(307, '/api/v1/auth/login'));
app.post('/api/auth/login', (req, res) => res.redirect(307, '/api/v1/auth/login'));
app.post('/api/auth/register', (req, res) => res.redirect(307, '/api/v1/auth/register'));

// ─────────────── Error Handling ───────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
