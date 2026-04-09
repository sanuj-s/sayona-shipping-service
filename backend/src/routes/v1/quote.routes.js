// ─────────────────────────────────────────────
// Quote Routes — /api/v1/quotes
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const quoteController = require('../../controllers/quote.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { authorizeMinRole } = require('../../middlewares/authorize');
const { formLimiter } = require('../../middlewares/rateLimiter');
const idempotencyMiddleware = require('../../middlewares/idempotency');
const validate = require('../../middlewares/validate');
const quoteValidator = require('../../validators/quote.validator');
const { USER_ROLES } = require('../../models/schemas');

// Public — submit quote request
router.post('/', formLimiter, validate(quoteValidator.submitQuote), idempotencyMiddleware, quoteController.submitQuote);

// Public — get quote estimate (rate-limited)
router.get('/estimate', quoteController.getEstimate);

// Staff+ — list and manage quotes
router.get('/', authenticate, authorizeMinRole(USER_ROLES.STAFF), validate(quoteValidator.getQuotes), quoteController.getQuotes);
router.put('/:uuid/status', authenticate, authorizeMinRole(USER_ROLES.STAFF), validate(quoteValidator.updateQuoteStatus), quoteController.updateQuoteStatus);
router.post('/:uuid/reply', authenticate, authorizeMinRole(USER_ROLES.STAFF), quoteController.replyToQuote);

module.exports = router;
