const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { formLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/contact
// @access  Public (rate-limited)
router.post('/', formLimiter, submitContact);

module.exports = router;
