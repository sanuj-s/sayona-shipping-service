// ─────────────────────────────────────────────
// Quote Model — Database queries for quote_requests table
// ─────────────────────────────────────────────
const pool = require('../config/db');

const Quote = {
    // Create a quote request
    create: async ({ name, email, phone, company, origin, destination, cargoType, weight, message }) => {
        const result = await pool.query(
            `INSERT INTO quote_requests (name, email, phone, company, origin, destination, cargo_type, weight, message)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at`,
            [name, email, phone || null, company || null, origin, destination, cargoType || null, weight || null, message || null]
        );
        return result.rows[0];
    },

    // Get all quote requests (newest first)
    findAll: async () => {
        const result = await pool.query(
            'SELECT * FROM quote_requests ORDER BY created_at DESC'
        );
        return result.rows;
    },

    // Update quote status
    updateStatus: async (id, status) => {
        const result = await pool.query(
            'UPDATE quote_requests SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        return result.rows[0] || null;
    },
};

module.exports = Quote;
