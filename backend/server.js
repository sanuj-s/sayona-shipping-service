// ─────────────────────────────────────────────
// Server Entry Point — Sayona Shipping Service
// Enterprise-grade logistics platform
// ─────────────────────────────────────────────
const app = require('./src/app');
const config = require('./src/config/environment');
const logger = require('./src/config/logger');
const { testConnection, close: closeDB } = require('./src/config/database');

async function startServer() {
    try {
        // Test database connectivity
        await testConnection();
        logger.info('✅ PostgreSQL connected', { host: config.db.host, database: config.db.name });

        // Start HTTP server
        const server = app.listen(config.port, () => {
            logger.info(`🚀 Server running on port ${config.port}`, {
                environment: config.nodeEnv,
                port: config.port,
            });
            logger.info(`📊 Admin panel: http://localhost:${config.port}/admin/login.html`);
            logger.info(`🔗 API Base: http://localhost:${config.port}/api/v1`);
            logger.info(`❤️  Health: http://localhost:${config.port}/api/v1/health`);
        });

        // Set server timeout
        server.timeout = 30000; // 30 seconds
        server.keepAliveTimeout = 65000; // Slightly higher than typical LB timeout

        // ─────────────── Graceful Shutdown ───────────────
        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received. Starting graceful shutdown...`);

            // Stop accepting new connections
            server.close(async () => {
                logger.info('HTTP server closed');

                try {
                    // Close database pool
                    await closeDB();
                    logger.info('Database connections closed');
                } catch (err) {
                    logger.error('Error closing database', { error: err.message });
                }

                logger.info('Graceful shutdown complete. Goodbye.');
                process.exit(0);
            });

            // Force exit after 15 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after 15s timeout');
                process.exit(1);
            }, 15000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // ─────────────── Unhandled Error Safety Net ───────────────
        process.on('unhandledRejection', (reason) => {
            logger.error('Unhandled Promise Rejection', { error: reason?.message || reason });
        });

        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception — shutting down', { error: error.message, stack: error.stack });
            process.exit(1);
        });

    } catch (error) {
        logger.error('❌ Failed to start server', { error: error.message });
        process.exit(1);
    }
}

startServer();
