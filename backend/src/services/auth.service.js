// ─────────────────────────────────────────────
// Auth Service — Business logic for authentication
// Features: brute-force protection, account locking,
// password reset, email verification
// Token security: all tokens hashed before persistence,
// expiry enforced, single-use with immediate invalidation
// ─────────────────────────────────────────────
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../config/environment');
const UserRepository = require('../repositories/user.repository');
const TokenService = require('./token.service');
const EmailService = require('./email.service');
const { AuthenticationError, ConflictError, ValidationError, NotFoundError, AccountLockedError } = require('../utils/AppError');

/**
 * Hash a token using SHA-256 for secure storage
 */
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const AuthService = {
    /**
     * Register a new company (tenant) and its initial admin user
     */
    registerCompany: async ({ companyName, domain, email, password }) => {
        if (await UserRepository.emailExists(email)) {
            throw new ConflictError('An account with this email already exists');
        }

        const passwordHash = await bcrypt.hash(password, config.security.saltRounds);
        
        // Single transaction safety
        const { pool } = require('../config/database');
        const client = await pool.connect();
        
        let user;
        let tenantId;

        try {
            await client.query('BEGIN');
            
            // 1. Create Tenant
            const tenantRes = await client.query(
                `INSERT INTO tenants (name, email, domain) VALUES ($1, $2, $3) RETURNING id`,
                [companyName, email, domain || null]
            );
            tenantId = tenantRes.rows[0].id;
            
            // 2. Create Admin User
            // Note: UserRepository.create is normally used, but we must use this specific transaction client
            const userRes = await client.query(
                `INSERT INTO users (name, email, password_hash, company, role, tenant_id, is_verified)
                 VALUES ($1, $2, $3, $4, 'admin', $5, TRUE)
                 RETURNING id, uuid, name, email, role, tenant_id, is_verified`,
                ['Admin', email, passwordHash, companyName, tenantId]
            );
            user = userRes.rows[0];

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

        // Generate auth tokens
        const accessToken = TokenService.generateAccessToken({
            id: user.id, uuid: user.uuid, role: user.role, tenant_id: user.tenant_id,
        });
        const refreshToken = await TokenService.generateRefreshToken(user.id);

        return {
            user: {
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                role: user.role,
                tenant_id: user.tenant_id,
                isVerified: user.is_verified,
            },
            accessToken,
            refreshToken,
        };
    },

    /**
     * Invite a new user to the existing tenant
     */
    inviteUser: async ({ name, email, password, role }, inviterTenantId) => {
        if (await UserRepository.emailExists(email)) {
            throw new ConflictError('An account with this email already exists');
        }

        // Strict role hierarchy logic could go here; allowing admin/manager/operator
        const safeRole = ['admin', 'manager', 'operator'].includes(role) ? role : 'operator';
        const passwordHash = await bcrypt.hash(password, config.security.saltRounds);

        // Uses standard repository since it's intercepted by the tenantStorage wrapper natively!
        const user = await UserRepository.create({
            name, email, passwordHash, role: safeRole
        });
        
        // Ensure tenant_id is explicitly set to inviter's (redundant if AsyncLocalStorage works, but safe)
        const { query } = require('../config/database');
        await query(`UPDATE users SET tenant_id = $1 WHERE id = $2`, [inviterTenantId, user.id]);

        return {
            uuid: user.uuid,
            name: user.name,
            email: user.email,
            role: user.role
        };
    },

    /**
     * Login with brute-force protection
     */
    login: async (email, password) => {
        const user = await UserRepository.findByEmail(email);

        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Check account lock
        if (user.is_locked) {
            if (user.lock_until && new Date(user.lock_until) > new Date()) {
                throw new AccountLockedError(user.lock_until);
            }
            // Lock expired — unlock
            await UserRepository.unlockAccount(user.id);
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            // Increment failed attempts
            const attempts = await UserRepository.incrementLoginAttempts(user.id);

            if (attempts >= config.security.maxLoginAttempts) {
                const lockUntil = new Date(Date.now() + config.security.lockDurationMs);
                await UserRepository.lockAccount(user.id, lockUntil);
                throw new AccountLockedError(lockUntil);
            }

            throw new AuthenticationError('Invalid email or password');
        }

        // Success — reset attempts
        await UserRepository.resetLoginAttempts(user.id);

        // Generate tokens
        const accessToken = TokenService.generateAccessToken({
            id: user.id, uuid: user.uuid, role: user.role, tenant_id: user.tenant_id,
        });
        const refreshToken = await TokenService.generateRefreshToken(user.id);

        return {
            user: {
                uuid: user.uuid,
                name: user.name,
                email: user.email,
                role: user.role,
                tenant_id: user.tenant_id,
                isVerified: user.is_verified,
            },
            accessToken,
            refreshToken,
        };
    },

    /**
     * Logout — revoke refresh token
     */
    logout: async (refreshToken) => {
        await TokenService.revokeRefreshToken(refreshToken);
    },

    /**
     * Get user profile
     */
    getProfile: async (userId) => {
        const user = await UserRepository.findById(userId);
        if (!user) throw new NotFoundError('User');
        return user;
    },

    /**
     * Update user profile
     */
    updateProfile: async (userId, data) => {
        const user = await UserRepository.updateProfile(userId, data);
        if (!user) throw new NotFoundError('User');
        return user;
    },

    /**
     * Request password reset
     */
    requestPasswordReset: async (email) => {
        const user = await UserRepository.findByEmail(email);
        // Always return success to not leak email existence
        if (!user) return { message: 'If an account exists, a reset link has been sent' };

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = hashToken(resetToken);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await UserRepository.setPasswordResetToken(user.id, tokenHash, expiresAt);

        EmailService.sendPasswordResetEmail(email, resetToken);

        return {
            message: 'If an account exists, a reset link has been sent',
            ...(config.isDevelopment() && { resetToken }),
        };
    },

    /**
     * Reset password with token — single-use enforcement
     */
    resetPassword: async (token, newPassword) => {
        const tokenHash = hashToken(token);
        const user = await UserRepository.findByResetToken(tokenHash);

        if (!user) {
            throw new ValidationError('Invalid or expired reset token');
        }

        const passwordHash = await bcrypt.hash(newPassword, config.security.saltRounds);
        // updatePassword clears reset token atomically (single-use)
        await UserRepository.updatePassword(user.id, passwordHash);

        // Revoke all refresh tokens (force re-login)
        await TokenService.revokeAllUserTokens(user.id);

        return { message: 'Password has been reset successfully' };
    },

    /**
     * Verify email — token is hashed, expiry-checked, single-use
     */
    verifyEmail: async (token) => {
        const tokenHash = hashToken(token);
        const user = await UserRepository.verifyEmail(tokenHash);
        if (!user) {
            throw new ValidationError('Invalid or expired verification token');
        }
        return { message: 'Email verified successfully', email: user.email };
    },
};

module.exports = AuthService;
