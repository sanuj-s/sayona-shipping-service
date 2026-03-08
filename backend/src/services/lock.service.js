const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');
const { ConflictError } = require('../utils/AppError');

class LockService {
    /**
     * Acquire a distributed lock.
     * @param {string} resourceKey - The identifier to lock (e.g., 'shipment:123')
     * @param {number} ttlMs - Lock time-to-live in milliseconds
     * @returns {string} - The lock token, needed to release it.
     */
    async acquireLock(resourceKey, ttlMs = 5000) {
        const redis = getRedisClient();
        if (!redis) {
            logger.warn('Redis unavailable, skipping distributed lock');
            return 'dummy-token';
        }

        const lockKey = `lock:${resourceKey}`;
        const token = Math.random().toString(36).substring(2, 15);

        // SETNX: Set if Not eXists
        const acquired = await redis.set(lockKey, token, 'PX', ttlMs, 'NX');

        if (!acquired) {
            logger.warn(`Failed to acquire lock for ${resourceKey}`);
            throw new ConflictError('Resource is currently being modified by another process. Please try again.');
        }

        return token;
    }

    /**
     * Release a distributed lock securely using a Lua script to ensure 
     * we only release if the token matches.
     */
    async releaseLock(resourceKey, token) {
        const redis = getRedisClient();
        if (!redis || token === 'dummy-token') return;

        const lockKey = `lock:${resourceKey}`;

        // Lua script: Get the key, if it matches token, delete it.
        const script = `
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `;

        try {
            await redis.eval(script, 1, lockKey, token);
        } catch (error) {
            logger.error(`Failed to release lock for ${resourceKey} with token ${token}`, error);
        }
    }
}

module.exports = new LockService();
