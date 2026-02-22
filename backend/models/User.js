// ─────────────────────────────────────────────
// User Model — Database queries for users table
// ─────────────────────────────────────────────
const pool = require('../config/db');

const User = {
    // Find user by email
    findByEmail: async (email) => {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    },

    // Find user by ID (excludes password)
    findById: async (id) => {
        const result = await pool.query(
            'SELECT id, name, email, phone, company, role, address, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    },

    // Create new user
    create: async ({ name, email, password, phone, company, role, address }) => {
        const result = await pool.query(
            `INSERT INTO users (name, email, password, phone, company, role, address)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, name, email, phone, company, role, address, created_at`,
            [name, email, password, phone || null, company || null, role || 'client', address || null]
        );
        return result.rows[0];
    },

    // Get all users (excludes passwords)
    findAll: async () => {
        const result = await pool.query(
            'SELECT id, name, email, phone, company, role, address, created_at FROM users ORDER BY created_at DESC'
        );
        return result.rows;
    },

    // Update user profile
    updateProfile: async (id, { name, phone, company, address }) => {
        const result = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 phone = COALESCE($2, phone), 
                 company = COALESCE($3, company), 
                 address = COALESCE($4, address)
             WHERE id = $5
             RETURNING id, name, email, phone, company, role, address, created_at`,
            [name, phone, company, address, id]
        );
        return result.rows[0];
    },

    // Check if email exists
    emailExists: async (email) => {
        const result = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );
        return result.rows.length > 0;
    },
};

module.exports = User;
