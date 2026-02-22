// ─────────────────────────────────────────────
// Quote Routes — /api/v1/quotes
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const quoteController = require('../../controllers/quote.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { authorizeMinRole } = require('../../middlewares/authorize');
const { formLimiter } = require('../../middlewares/rateLimiter');
const validate = require('../../middlewares/validate');
const quoteValidator = require('../../validators/quote.validator');
const { USER_ROLES } = require('../../models/schemas');

// Public — submit quote (rate-limited)
router.post('/', formLimiter, validate(quoteValidator.submitQuote), quoteController.submitQuote);

// Staff+ — list and manage quotes
router.get('/', authenticate, authorizeMinRole(USER_ROLES.STAFF), validate(quoteValidator.getQuotes), quoteController.getQuotes);
router.put('/:uuid/status', authenticate, authorizeMinRole(USER_ROLES.STAFF), validate(quoteValidator.updateQuoteStatus), quoteController.updateQuoteStatus);

module.exports = router;
