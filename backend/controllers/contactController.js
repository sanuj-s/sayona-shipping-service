// ─────────────────────────────────────────────
// Contact Controller — HTTP handlers for contact form
// Uses: Contact Model → DB
// ─────────────────────────────────────────────
const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Name, email, and message are required' });
        }

        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ message: 'Please provide a valid email' });
        }

        const result = await Contact.create({ name, email, phone, subject, message });

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon.',
            id: result.id,
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
        const messages = await Contact.findAll();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark contact as read (admin)
// @route   PUT /api/admin/contacts/:id/read
// @access  Private (admin)
const markContactRead = async (req, res) => {
    try {
        const result = await Contact.markRead(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Contact message not found' });
        }
        res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitContact, getContacts, markContactRead };
