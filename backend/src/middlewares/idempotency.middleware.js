const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Middleware to enforce idempotency for critical POST/PUT endpoints
 * Uses Idempotency-Key header and caches the response in Redis.
 */
const idempotencyMiddleware = async (req, res, next) => {
    // Only apply to state-mutating requests
    if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
        return next();
    }

    const idempotencyKey = req.headers['idempotency-key'];
    if (!idempotencyKey) {
        // Enforce Idempotency-Key for endpoints that use this middleware? 
        // We'll make it optional but highly recommended.
        return next();
    }

    const redis = getRedisClient();
    if (!redis) {
        logger.warn('Redis client not available, skipping idempotency check');
        return next();
    }

    const cacheKey = `idempotency:${req.user?.id || 'public'}:${req.originalUrl}:${idempotencyKey}`;

    try {
        // Check if we already processed this request
        const cachedResponseStr = await redis.get(cacheKey);

        if (cachedResponseStr) {
            logger.info(`[Idempotency] Returning cached response for key: ${idempotencyKey}`);
            const cachedResponse = JSON.parse(cachedResponseStr);
            return res.status(cachedResponse.statusCode).json(cachedResponse.body);
        }

        // We haven't processed it. Intercept the response to save it.
        const originalJson = res.json.bind(res);
        const originalSend = res.send.bind(res);

        const saveResponse = (body) => {
            const responseData = {
                statusCode: res.statusCode,
                body: body,
            };

            // Store for 24 hours
            redis.setex(cacheKey, 24 * 60 * 60, JSON.stringify(responseData))
                .catch(err => logger.error(`[Idempotency] Failed to cache response:`, err));
        };

        res.json = function (body) {
            saveResponse(body);
            return originalJson(body);
        };

        res.send = function (body) {
            // Only try to cache JSON objects via send if they are parsable, else skip.
            // (Most of our API uses res.json via responseHelper anyway)
            if (typeof body === 'string') {
                try {
                    saveResponse(JSON.parse(body));
                } catch {
                    // Not JSON, ignore
                }
            } else if (typeof body === 'object') {
                saveResponse(body);
            }
            return originalSend(body);
        };

        next();

    } catch (error) {
        logger.error(`[Idempotency] Error processing key ${idempotencyKey}:`, error);
        next(); // Proceed normally if Redis fails
    }
};

module.exports = idempotencyMiddleware;
