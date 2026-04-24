// ─────────────────────────────────────────────
// Database Configuration — PostgreSQL Pool
// SSL is FORCE DISABLED (VPS PostgreSQL has no SSL)
// ─────────────────────────────────────────────
const { Pool } = require('pg');
const logger = require('./logger');

const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    ssl: false,
    max: parseInt(process.env.DB_POOL_MAX, 10) || 20,
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000,
    connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT, 10) || 5000,
});

pool.on('connect', () => {
    logger.debug('New PostgreSQL client connected');
});

pool.on('error', (err) => {
    logger.error('Unexpected PostgreSQL pool error', { error: err.message });
});

const { AsyncLocalStorage } = require('async_hooks');
const tenantStorage = new AsyncLocalStorage();

const query = async (text, params) => {
    const tenantId = tenantStorage.getStore();
    
    // Execute query in a strictly isolated tenant context via PostgreSQL RLS
    if (tenantId && !text.includes('pg_') && !text.includes('SET LOCAL') && !text.includes('BEGIN') && !text.includes('COMMIT') && !text.includes('ROLLBACK')) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            await client.query(`SET LOCAL app.current_tenant = '${tenantId}'`);
            
            const start = Date.now();
            const result = await client.query(text, params);
            const duration = Date.now() - start;
            
            logger.debug('Query executed (Isolated Tenant)', {
                tenantId,
                query: text.substring(0, 100),
                duration: `${duration}ms`,
                rows: result.rowCount,
            });
            
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Query failed (Isolated Tenant)', {
                tenantId,
                query: text.substring(0, 100),
                error: error.message,
            });
            throw error;
        } finally {
            client.release();
        }
    }

    // Default execution for generic system queries (e.g. initial auth checks or background tasks)
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        logger.debug('Query executed', {
            query: text.substring(0, 100),
            duration: `${duration}ms`,
            rows: result.rowCount,
        });
        return result;
    } catch (error) {
        logger.error('Query failed', {
            query: text.substring(0, 100),
            error: error.message,
        });
        throw error;
    }
};

const getClient = async () => {
    return pool.connect();
};

const testConnection = async () => {
    await pool.query('SELECT 1');
};

const close = async () => {
    await pool.end();
};

module.exports = { pool, query, getClient, testConnection, close, tenantStorage };
