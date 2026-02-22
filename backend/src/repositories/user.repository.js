// ─────────────────────────────────────────────
// User Repository — DB abstraction for users table
// ─────────────────────────────────────────────
const { query, getClient } = require('../config/database');

const UserRepository = {
    /**
     * Find user by email (includes password_hash for auth)
     */
    findByEmail: async (email) => {
        const result = await query(
            'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
            [email]
        );
        return result.rows[0] || null;
    },

    /**
     * Find user by ID (excludes password_hash)
     */
    findById: async (id) => {
        const result = await query(
            `SELECT id, uuid, name, email, phone, company, role, address, 
                    is_verified, is_locked, created_at, updated_at, version
             FROM users WHERE id = $1 AND deleted_at IS NULL`,
            [id]
        );
        return result.rows[0] || null;
    },

    /**
     * Find user by UUID (excludes password_hash)
     */
    findByUuid: async (uuid) => {
        const result = await query(
            `SELECT id, uuid, name, email, phone, company, role, address, 
                    is_verified, is_locked, created_at, updated_at, version
             FROM users WHERE uuid = $1 AND deleted_at IS NULL`,
            [uuid]
        );
        return result.rows[0] || null;
    },

    /**
     * Create a new user
     */
    create: async ({ name, email, passwordHash, phone, company, role, address }) => {
        const result = await query(
            `INSERT INTO users (name, email, password_hash, phone, company, role, address)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, uuid, name, email, phone, company, role, address, is_verified, created_at`,
            [name, email, passwordHash, phone || null, company || null, role || 'client', address || null]
        );
        return result.rows[0];
    },

    /**
     * Find all users (paginated, excludes deleted)
     */
    findAll: async ({ limit, offset, sortBy, sortOrder }) => {
        const result = await query(
            `SELECT id, uuid, name, email, phone, company, role, address, 
                    is_verified, is_locked, created_at, updated_at
             FROM users WHERE deleted_at IS NULL
             ORDER BY ${sortBy} ${sortOrder} LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    },

    /**
     * Count all active users
     */
    countAll: async () => {
        const result = await query(
            'SELECT COUNT(*) as count FROM users WHERE deleted_at IS NULL'
        );
        return parseInt(result.rows[0].count, 10);
    },

    /**
     * Update user profile
     */
    updateProfile: async (id, { name, phone, company, address }) => {
        const result = await query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 phone = COALESCE($2, phone), 
                 company = COALESCE($3, company), 
                 address = COALESCE($4, address)
             WHERE id = $5 AND deleted_at IS NULL
             RETURNING id, uuid, name, email, phone, company, role, address, is_verified, created_at, updated_at`,
            [name, phone, company, address, id]
        );
        return result.rows[0] || null;
    },

    /**
     * Update user role
     */
    updateRole: async (id, role) => {
        const result = await query(
            `UPDATE users SET role = $1 WHERE id = $2 AND deleted_at IS NULL
             RETURNING id, uuid, name, email, role, updated_at`,
            [role, id]
        );
        return result.rows[0] || null;
    },

    /**
     * Increment failed login attempts
     */
    incrementLoginAttempts: async (id) => {
        const result = await query(
            `UPDATE users SET failed_login_attempts = failed_login_attempts + 1 
             WHERE id = $1 RETURNING failed_login_attempts`,
            [id]
        );
        return result.rows[0]?.failed_login_attempts || 0;
    },

    /**
     * Lock account
     */
    lockAccount: async (id, lockUntil) => {
        await query(
            'UPDATE users SET is_locked = TRUE, lock_until = $1 WHERE id = $2',
            [lockUntil, id]
        );
    },

    /**
     * Unlock account and reset attempts
     */
    unlockAccount: async (id) => {
        await query(
            'UPDATE users SET is_locked = FALSE, failed_login_attempts = 0, lock_until = NULL WHERE id = $1',
            [id]
        );
    },

    /**
     * Reset failed login attempts on successful login
     */
    resetLoginAttempts: async (id) => {
        await query(
            'UPDATE users SET failed_login_attempts = 0, is_locked = FALSE, lock_until = NULL WHERE id = $1',
            [id]
        );
    },

    /**
     * Store password reset token
     */
    setPasswordResetToken: async (id, tokenHash, expiresAt) => {
        await query(
            'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
            [tokenHash, expiresAt, id]
        );
    },

    /**
     * Find user by password reset token
     */
    findByResetToken: async (tokenHash) => {
        const result = await query(
            `SELECT id, uuid, email, password_reset_expires FROM users 
             WHERE password_reset_token = $1 AND password_reset_expires > NOW() AND deleted_at IS NULL`,
            [tokenHash]
        );
        return result.rows[0] || null;
    },

    /**
     * Update password and clear reset token
     */
    updatePassword: async (id, passwordHash) => {
        await query(
            `UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_expires = NULL 
             WHERE id = $2`,
            [passwordHash, id]
        );
    },

    /**
     * Set email verification token
     */
    setVerificationToken: async (id, token) => {
        await query(
            'UPDATE users SET email_verification_token = $1 WHERE id = $2',
            [token, id]
        );
    },

    /**
     * Verify email
     */
    verifyEmail: async (token) => {
        const result = await query(
            `UPDATE users SET is_verified = TRUE, email_verification_token = NULL 
             WHERE email_verification_token = $1 AND deleted_at IS NULL
             RETURNING id, uuid, email`,
            [token]
        );
        return result.rows[0] || null;
    },

    /**
     * Soft delete user
     */
    softDelete: async (id) => {
        const result = await query(
            `UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL
             RETURNING id, uuid`,
            [id]
        );
        return result.rows[0] || null;
    },

    /**
     * Check if email exists (including soft-deleted)
     */
    emailExists: async (email) => {
        const result = await query(
            'SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL',
            [email]
        );
        return result.rows.length > 0;
    },
};

module.exports = UserRepository;
