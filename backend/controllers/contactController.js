const pool = require('../config/db');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required' });
        }

        // Basic email validation
        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ message: 'Please provide a valid email' });
        }

        const result = await pool.query(
            `INSERT INTO contact_messages (name, email, phone, subject, message)
             VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`,
            [name, email, phone || null, subject || 'General Inquiry', message]
        );

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon.',
            id: result.rows[0].id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all contact messages (admin)
// @route   GET /api/admin/contacts
// @access  Private (admin)
const getContacts = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark contact as read (admin)
// @route   PUT /api/admin/contacts/:id/read
// @access  Private (admin)
const markContactRead = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'UPDATE contact_messages SET is_read = TRUE WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Contact message not found' });
        }

        res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitContact, getContacts, markContactRead };
