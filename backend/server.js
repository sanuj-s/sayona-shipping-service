const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');

dotenv.config();

const pool = require('./config/db');
const initDB = require('./init_db');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ─────────────── Security Middleware ───────────────
app.use(helmet({
    contentSecurityPolicy: false,   // Allow inline scripts in admin panel
    crossOriginEmbedderPolicy: false,
}));
app.use(hpp());

// ─────────────── General Middleware ───────────────
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Rate limiting on all API routes
app.use('/api', apiLimiter);

// ─────────────── Static Files ───────────────
// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Serve main website
app.use(express.static(path.join(__dirname, '..'), {
    extensions: ['html'],
    index: 'index.html',
}));

// ─────────────── Health Check ───────────────
app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: 'connected',
            environment: process.env.NODE_ENV || 'development',
        });
    } catch (error) {
        res.status(503).json({
            status: 'error',
            database: 'disconnected',
            message: error.message,
        });
    }
});

// ─────────────── API Routes ───────────────
const authRoutes = require('./routes/authRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');
const quoteRoutes = require('./routes/quoteRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/quote', quoteRoutes);

// ─────────────── Error Handling ───────────────
app.use(notFound);
app.use(errorHandler);

// ─────────────── Server Start ───────────────
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await pool.query('SELECT 1');
        console.log('✅ PostgreSQL connected');

        await initDB();

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
            console.log(`📊 Admin panel: http://localhost:${PORT}/admin/login.html`);
            console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
        });

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            console.log(`\n${signal} received. Shutting down gracefully...`);
            server.close(() => {
                pool.end(() => {
                    console.log('Database pool closed. Goodbye.');
                    process.exit(0);
                });
            });

            // Force exit after 10 seconds
            setTimeout(() => {
                console.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1);
    }
}

startServer();
