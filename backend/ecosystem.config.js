module.exports = {
    apps: [
        {
            name: 'sayona-api',
            script: './server.js',
            instances: 'max', // Scale horizontally based on CPU cores
            exec_mode: 'cluster',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
            }
        },
        {
            name: 'sayona-worker',
            script: './worker.js',
            instances: 2, // 2 dedicated background threads for queues
            autorestart: true,
            watch: false,
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            }
        }
    ]
};
