// ─────────────────────────────────────────────
// Idempotency Middleware — Prevent duplicate execution
// Secures POST requests like Shipments or Payments
// ─────────────────────────────────────────────
const { getClient } = require('../config/redis');
const { AppError } = require('../utils/AppError');

const idempotency = async (req, res, next) => {
    // Only intercept unsafe mutating methods
    if (req.method !== 'POST') return next();

    const idempotencyKey = req.headers['x-idempotency-key'];
    // Fast path: pass-through if not provided
    if (!idempotencyKey) return next();

    const redis = getClient();
    const cacheKey = `idempotency:${req.user?.id || 'anon'}:${idempotencyKey}`;

    try {
        const cachedResponse = await redis.get(cacheKey);

        if (cachedResponse) {
            // Short-circuit execution and return exact previous payload
            const payload = JSON.parse(cachedResponse);
            
            // Re-apply original headers
            if (payload.headers) {
                for (const [key, value] of Object.entries(payload.headers)) {
                    res.setHeader(key, value);
                }
            }
            res.setHeader('X-Idempotency-Cache', 'HIT');
            return res.status(payload.statusCode).json(payload.body);
        }

        // Intercept Express res.json to capture output payload
        const originalJson = res.json;
        res.json = function (body) {
            // Restore original reference
            res.json = originalJson;
            
            // Only cache successful (2xx) requests
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const responseMap = {
                    statusCode: res.statusCode,
                    body: body,
                    headers: Object.assign({}, res.getHeaders())
                };

                // Store idempotency cache for exactly 24 hours
                redis.setEx(cacheKey, 86400, JSON.stringify(responseMap)).catch(_err => {
                    console.error('[Idempotency] Failed to cache response:', _err.message);
                });
            }

            return res.json(body);
        };

        res.setHeader('X-Idempotency-Cache', 'MISS');
        next();

    } catch (_error) {
        next(new AppError('Failed idempotency lock check', 500, 'ERR_IDEMPOTENCY'));
    }
};

module.exports = idempotency;
