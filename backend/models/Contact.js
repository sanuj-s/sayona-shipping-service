// ─────────────────────────────────────────────
// Contact Model — Database queries for contact_messages table
// ─────────────────────────────────────────────
const pool = require('../config/db');

const Contact = {
    // Create a contact message
    create: async ({ name, email, phone, subject, message }) => {
        const result = await pool.query(
            `INSERT INTO contact_messages (name, email, phone, subject, message)
             VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
            [name, email, phone || null, subject || 'General Inquiry', message]
        );
        return result.rows[0];
    },

    // Get all messages (newest first)
    findAll: async () => {
        const result = await pool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );
        return result.rows;
    },

    // Mark as read
    markRead: async (id) => {
        const result = await pool.query(
            'UPDATE contact_messages SET is_read = TRUE WHERE id = $1 RETURNING *',
            [id]
        );
        return result.rows[0] || null;
    },
};

module.exports = Contact;
