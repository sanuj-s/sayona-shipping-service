// ─────────────────────────────────────────────
// Database Configuration — PostgreSQL Pool
// ─────────────────────────────────────────────
const { Pool } = require('pg');
const config = require('./environment');
const logger = require('./logger');

const pool = new Pool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    max: config.db.poolMax,
    idleTimeoutMillis: config.db.idleTimeoutMs,
    connectionTimeoutMillis: config.db.connectionTimeoutMs,
});

pool.on('connect', () => {
    logger.debug('New PostgreSQL client connected');
});

pool.on('error', (err) => {
    logger.error('Unexpected PostgreSQL pool error', { error: err.message });
});

/**
 * Execute a query with logging
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = async (text, params) => {
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

/**
 * Get a client for transactions
 * @returns {Promise<import('pg').PoolClient>}
 */
const getClient = async () => {
    return pool.connect();
};

/**
 * Test database connectivity
 */
const testConnection = async () => {
    await pool.query('SELECT 1');
};

/**
 * Close all connections
 */
const close = async () => {
    await pool.end();
};

module.exports = { pool, query, getClient, testConnection, close };
