// ─────────────────────────────────────────────
// Token Service — Access + Refresh token management
// ─────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/environment');
const { query } = require('../config/database');
const { AuthenticationError } = require('../utils/AppError');

const TokenService = {
    /**
     * Generate JWT access token (short-lived)
     */
    generateAccessToken: (user) => {
        return jwt.sign(
            { id: user.id, uuid: user.uuid, role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.accessExpiry }
        );
    },

    /**
     * Generate refresh token (long-lived, stored in DB)
     */
    generateRefreshToken: async (userId) => {
        const token = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date(Date.now() + parseDuration(config.jwt.refreshExpiry));

        await query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [userId, token, expiresAt]
        );

        return token;
    },

    /**
     * Refresh access token using refresh token
     * Implements token rotation — old refresh token is invalidated
     */
    refreshAccessToken: async (refreshToken) => {
        // Find the refresh token
        const result = await query(
            `SELECT rt.*, u.id as user_id, u.uuid, u.role, u.is_locked, u.deleted_at
             FROM refresh_tokens rt
             JOIN users u ON rt.user_id = u.id
             WHERE rt.token = $1`,
            [refreshToken]
        );

        const tokenRecord = result.rows[0];
        if (!tokenRecord) {
            throw new AuthenticationError('Invalid refresh token');
        }

        // Check expiry
        if (new Date(tokenRecord.expires_at) < new Date()) {
            await query('DELETE FROM refresh_tokens WHERE id = $1', [tokenRecord.id]);
            throw new AuthenticationError('Refresh token has expired');
        }

        // Check user status
        if (tokenRecord.is_locked || tokenRecord.deleted_at) {
            await query('DELETE FROM refresh_tokens WHERE user_id = $1', [tokenRecord.user_id]);
            throw new AuthenticationError('Account is locked or deactivated');
        }

        // Delete old refresh token (rotation)
        await query('DELETE FROM refresh_tokens WHERE id = $1', [tokenRecord.id]);

        // Generate new token pair
        const user = { id: tokenRecord.user_id, uuid: tokenRecord.uuid, role: tokenRecord.role };
        const accessToken = TokenService.generateAccessToken(user);
        const newRefreshToken = await TokenService.generateRefreshToken(tokenRecord.user_id);

        return { accessToken, refreshToken: newRefreshToken };
    },

    /**
     * Revoke a specific refresh token (logout)
     */
    revokeRefreshToken: async (refreshToken) => {
        await query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    },

    /**
     * Revoke all refresh tokens for a user (force logout everywhere)
     */
    revokeAllUserTokens: async (userId) => {
        await query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
    },

    /**
     * Clean up expired refresh tokens
     */
    cleanupExpiredTokens: async () => {
        const result = await query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
        return result.rowCount;
    },
};

/**
 * Parse duration string to milliseconds (e.g., '7d', '15m', '1h')
 */
function parseDuration(str) {
    const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    const match = str.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 86400000; // default 7 days
    return parseInt(match[1], 10) * units[match[2]];
}

module.exports = TokenService;
