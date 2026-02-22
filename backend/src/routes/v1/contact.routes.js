// ─────────────────────────────────────────────
// Contact Routes — /api/v1/contacts
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/contact.controller');
const { formLimiter } = require('../../middlewares/rateLimiter');
const validate = require('../../middlewares/validate');
const contactValidator = require('../../validators/contact.validator');

// Public — submit contact (rate-limited)
router.post('/', formLimiter, validate(contactValidator.submitContact), contactController.submitContact);

module.exports = router;
