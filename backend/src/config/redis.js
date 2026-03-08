const Redis = require('ioredis');
const logger = require('../utils/logger');
const { environment } = require('./environment');

let redisClient;

const initRedis = () => {
    if (!environment.isProduction && !process.env.REDIS_HOST) {
        logger.warn('Redis not configured. Skipping connection.');
        return null;
    }

    const host = process.env.REDIS_HOST || 'localhost';
    const port = process.env.REDIS_PORT || 6379;

    redisClient = new Redis({
        host,
        port,
        retryStrategy(times) {
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    });

    redisClient.on('connect', () => {
        logger.info(`Redis connected to ${host}:${port}`);
    });

    redisClient.on('error', (err) => {
        logger.error('Redis connection error:', err);
    });

    return redisClient;
};

const getRedisClient = () => {
    if (!redisClient) {
        initRedis();
    }
    return redisClient;
};

module.exports = {
    initRedis,
    getRedisClient
};
