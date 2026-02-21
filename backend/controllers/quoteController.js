const pool = require('../config/db');

// @desc    Submit quote request
// @route   POST /api/quote
// @access  Public
const submitQuote = async (req, res) => {
    try {
        const { name, email, phone, company, origin, destination, cargoType, weight, message } = req.body;

        if (!name || !email || !origin || !destination) {
            return res.status(400).json({ message: 'Name, email, origin, and destination are required' });
        }

        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ message: 'Please provide a valid email' });
        }

        const result = await pool.query(
            `INSERT INTO quote_requests (name, email, phone, company, origin, destination, cargo_type, weight, message)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, created_at`,
            [name, email, phone || null, company || null, origin, destination, cargoType || null, weight || null, message || null]
        );

        res.status(201).json({
            success: true,
            message: 'Your quote request has been submitted. Our team will contact you shortly.',
            id: result.rows[0].id,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all quote requests (admin)
// @route   GET /api/admin/quotes
// @access  Private (admin)
const getQuotes = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM quote_requests ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update quote request status (admin)
// @route   PUT /api/admin/quotes/:id/status
// @access  Private (admin)
const updateQuoteStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const valid = ['pending', 'reviewed', 'quoted', 'accepted', 'rejected'];
        if (!valid.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${valid.join(', ')}` });
        }

        const result = await pool.query(
            'UPDATE quote_requests SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Quote request not found' });
        }

        res.json({ success: true, message: `Quote status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitQuote, getQuotes, updateQuoteStatus };
