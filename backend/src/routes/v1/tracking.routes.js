// ─────────────────────────────────────────────
// Tracking Routes — /api/v1/tracking
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const trackingController = require('../../controllers/tracking.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { authorizeMinRole } = require('../../middlewares/authorize');
const validate = require('../../middlewares/validate');
const trackingValidator = require('../../validators/tracking.validator');
const { USER_ROLES } = require('../../models/schemas');

// Public — get tracking history
router.get('/:trackingNumber', validate(trackingValidator.trackingParam), trackingController.getTracking);

// Staff+ — add tracking event
router.post('/', authenticate, authorizeMinRole(USER_ROLES.STAFF), validate(trackingValidator.addEvent), trackingController.addTrackingEvent);

module.exports = router;
