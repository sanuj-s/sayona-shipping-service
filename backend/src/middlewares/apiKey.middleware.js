const crypto = require('crypto');
const { query } = require('../config/database');
const logger = require('../utils/logger');
const { AuthenticationError } = require('../utils/AppError');

/**
 * Validates the X-API-Key header against the database to allow integration access.
 */
const apiKeyAuth = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            throw new AuthenticationError('API Key is missing');
        }

        // Hash the incoming key to compare with the DB storage
        const hash = crypto.createHash('sha256').update(apiKey).digest('hex');

        // Check the database
        const result = await query(
            'SELECT * FROM api_keys WHERE key_hash = $1 AND is_active = TRUE',
            [hash]
        );

        if (result.rows.length === 0) {
            throw new AuthenticationError('Invalid API Key');
        }

        const keyRecord = result.rows[0];

        // Attach external application info context to the request
        req.user = {
            id: null,
            email: keyRecord.client_name,
            role: 'external_integration',
            permissions: keyRecord.permissions || [],
            isApiKey: true // Flag to allow alternative flows
        };

        // Update last used timestamp
        query('UPDATE api_keys SET last_used_at = NOW() WHERE id = $1', [keyRecord.id]).catch(err => {
            logger.error(`Failed to update last_used_at for API key ${keyRecord.client_name}`, err);
        });

        next();
    } catch (error) {
        // Intercept standard missing key and log failed integrations cleanly
        logger.warn(`Failed external API Integration Login check via IP ${req.ip}`);
        next(error);
    }
};

module.exports = apiKeyAuth;
