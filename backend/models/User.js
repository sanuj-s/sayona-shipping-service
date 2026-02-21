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
            'SELECT id, name, email, phone, company, role, created_at FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    },

    // Create new user
    create: async ({ name, email, password, phone, company, role }) => {
        const result = await pool.query(
            `INSERT INTO users (name, email, password, phone, company, role)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, name, email, phone, company, role, created_at`,
            [name, email, password, phone || null, company || null, role || 'employee']
        );
        return result.rows[0];
    },

    // Get all users (excludes passwords)
    findAll: async () => {
        const result = await pool.query(
            'SELECT id, name, email, phone, company, role, created_at FROM users ORDER BY created_at DESC'
        );
        return result.rows;
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
