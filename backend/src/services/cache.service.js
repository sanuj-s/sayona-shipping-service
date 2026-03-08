const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

// Generic wrapper for get/set cache logic to transparently handle missing redis instances
class CacheService {
    constructor() {
        this.client = null;
        try {
            this.client = getRedisClient();
        } catch (err) {
            logger.warn('CacheService: Redis client not available.');
        }
    }

    async get(key) {
        if (!this.client) return null;

        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            logger.error(`Cache Read Error (${key}):`, err);
            return null;
        }
    }

    async set(key, value, ttlSeconds = 3600) {
        if (!this.client) return false;

        try {
            await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
            return true;
        } catch (err) {
            logger.error(`Cache Write Error (${key}):`, err);
            return false;
        }
    }

    async del(key) {
        if (!this.client) return false;

        try {
            await this.client.del(key);
            return true;
        } catch (err) {
            logger.error(`Cache Delete Error (${key}):`, err);
            return false;
        }
    }
}

module.exports = new CacheService();
