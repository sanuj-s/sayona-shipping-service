// ─────────────────────────────────────────────
// PM2 Ecosystem Configuration
// Usage: pm2 start ecosystem.config.js --env production
// ─────────────────────────────────────────────
module.exports = {
    apps: [
        {
            name: 'sayona-api',
            script: 'server.js',
            instances: 'max',
            exec_mode: 'cluster',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                PORT: 3000,
            },
            env_staging: {
                NODE_ENV: 'staging',
                PORT: 3000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            log_date_format: 'YYYY-MM-DD HH:mm:ss.SSS',
            error_file: 'logs/pm2-error.log',
            out_file: 'logs/pm2-out.log',
            merge_logs: true,
            // Graceful shutdown
            kill_timeout: 15000,
            listen_timeout: 10000,
            // Health monitoring
            max_restarts: 10,
            min_uptime: '10s',
        },
    ],
};
