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
            // Short-circuit execution and return exact previous payload securely
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

        // Intercept Express res.json/res.send to capture output payload securely natively
        const originalJson = res.json;
        res.json = function (body) {
            // Restore original reference
            res.json = originalJson;
            
            // Only cache successful (2xx) requests natively
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const responseMap = {
                    statusCode: res.statusCode,
                    body: body,
                    headers: Object.assign({}, res.getHeaders())
                };

                // Store idempotency cache for exactly 24 hours safely
                redis.setEx(cacheKey, 86400, JSON.stringify(responseMap)).catch(err => {
                   console.error('[Idempotency] Failed to cache response natively:', err);
                });
            }

            return res.json(body);
        };

        res.setHeader('X-Idempotency-Cache', 'MISS');
        next();

    } catch (error) {
        next(new AppError('Failed idempotency lock check natively', 500, 'ERR_IDEMPOTENCY'));
    }
};

module.exports = idempotency;
