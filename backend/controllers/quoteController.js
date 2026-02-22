// ─────────────────────────────────────────────
// Quote Controller — HTTP handlers for quote requests
// Uses: Quote Model → DB
// ─────────────────────────────────────────────
const Quote = require('../models/Quote');

// @desc    Submit quote request
// @route   POST /api/quote
// @access  Public
const submitQuote = async (req, res) => {
    try {
        const { name, email, phone, company, origin, destination, cargoType, weight, message } = req.body;

        if (!name || !email || !origin || !destination) {
            return res.status(400).json({ message: 'Name, email, origin, and destination are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        const result = await Quote.create({ name, email, phone, company, origin, destination, cargoType, weight, message });

        // -- EMAIL NOTIFICATION STUB --
        // In production, integrate SendGrid/Nodemailer here:
        // await EmailService.send({ to: 'admin@sayona.com', subject: 'New Quote Request', body: ... })
        console.log(`[EMAIL STUB] Notification sent to Admin for new Quote Request from ${email}`);

        res.status(201).json({
            message: 'Quote request submitted successfully',
            id: result.id,
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
        const quotes = await Quote.findAll();
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update quote request status (admin)
// @route   PUT /api/admin/quotes/:id/status
// @access  Private (admin)
const updateQuoteStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const valid = ['pending', 'reviewed', 'quoted', 'accepted', 'rejected'];
        if (!valid.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${valid.join(', ')}` });
        }

        const result = await Quote.updateStatus(req.params.id, status);
        if (!result) {
            return res.status(404).json({ message: 'Quote request not found' });
        }

        res.json({ success: true, message: `Quote status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitQuote, getQuotes, updateQuoteStatus };
