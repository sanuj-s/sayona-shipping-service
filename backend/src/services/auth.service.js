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
     * Register a new user
     */
    register: async ({ name, email, password, phone, company, role }) => {
        if (await UserRepository.emailExists(email)) {
            throw new ConflictError('An account with this email already exists');
        }

        const passwordHash = await bcrypt.hash(password, config.security.saltRounds);

        // Prevent self-registration as admin/staff
        const safeRole = (role === 'admin' || role === 'staff') ? 'client' : (role || 'client');

        const user = await UserRepository.create({
            name, email, passwordHash, phone, company, role: safeRole,
        });

        // Generate verification token — hash before storage, enforce 24h expiry
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenHash = hashToken(verificationToken);
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await UserRepository.setVerificationToken(user.id, verificationTokenHash, verificationExpires);

        EmailService.sendVerificationEmail(email, verificationToken);

        // Generate auth tokens
        const accessToken = TokenService.generateAccessToken(user);
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
            ...(config.isDevelopment() && { verificationToken }),
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
