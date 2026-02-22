// ─────────────────────────────────────────────
// Authentication Middleware — Unified JWT verification
// Supports access tokens via Authorization: Bearer <token>
// ─────────────────────────────────────────────
const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const { query } = require('../config/database');
const { AuthenticationError } = require('../utils/AppError');

/**
 * Verify JWT and attach user to request
 * Checks: token validity, user existence, account lock, soft delete
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('No authentication token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new AuthenticationError('No authentication token provided');
        }

        let decoded;
        try {
            decoded = jwt.verify(token, config.jwt.secret);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new AuthenticationError('Token has expired');
            }
            throw new AuthenticationError('Invalid authentication token');
        }

        // Look up user — exclude password, check not deleted/locked
        const result = await query(
            `SELECT id, uuid, name, email, phone, company, role, address, 
                    is_verified, is_locked, lock_until, created_at, updated_at
             FROM users 
             WHERE id = $1 AND deleted_at IS NULL`,
            [decoded.id]
        );

        const user = result.rows[0];
        if (!user) {
            throw new AuthenticationError('User account not found or has been deactivated');
        }

        // Check if account is locked
        if (user.is_locked) {
            if (user.lock_until && new Date(user.lock_until) > new Date()) {
                throw new AuthenticationError('Account is temporarily locked');
            }
            // Lock has expired — unlock the account
            await query(
                'UPDATE users SET is_locked = FALSE, failed_login_attempts = 0, lock_until = NULL WHERE id = $1',
                [user.id]
            );
            user.is_locked = false;
        }

        // Attach user to request (never expose password_hash)
        req.user = {
            id: user.id,
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            company: user.company,
            role: user.role,
            address: user.address,
            isVerified: user.is_verified,
            createdAt: user.created_at,
        };

        next();
    } catch (error) {
        if (error instanceof AuthenticationError) {
            return next(error);
        }
        next(new AuthenticationError('Authentication failed'));
    }
};

/**
 * Optional authentication — attaches user if token present, continues otherwise
 */
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    return authenticate(req, res, next);
};

module.exports = { authenticate, optionalAuth };
