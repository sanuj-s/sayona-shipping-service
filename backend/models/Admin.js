// ─────────────────────────────────────────────
// Admin Model — Database queries for admins table
// ─────────────────────────────────────────────
const pool = require('../config/db');

const Admin = {
    // Find admin by email
    findByEmail: async (email) => {
        const result = await pool.query(
            'SELECT * FROM admins WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    },

    // Find admin by ID (excludes password_hash)
    findById: async (id) => {
        const result = await pool.query(
            'SELECT id, name, email, created_at FROM admins WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    },

    // Create new admin
    create: async ({ name, email, passwordHash }) => {
        const result = await pool.query(
            `INSERT INTO admins (name, email, password)
             VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
            [name, email, passwordHash]
        );
        return result.rows[0];
    },

    // Check if admin email exists
    emailExists: async (email) => {
        const result = await pool.query(
            'SELECT id FROM admins WHERE email = $1',
            [email]
        );
        return result.rows.length > 0;
    },
};

module.exports = Admin;
