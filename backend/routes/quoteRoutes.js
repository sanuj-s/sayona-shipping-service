const express = require('express');
const router = express.Router();
const { submitQuote } = require('../controllers/quoteController');
const { formLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/quote
// @access  Public (rate-limited)
router.post('/', formLimiter, submitQuote);

module.exports = router;
