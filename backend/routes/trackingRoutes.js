const express = require('express');
const router = express.Router();
const { getTracking, updateTracking } = require('../controllers/trackingController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/tracking/:trackingNumber
// @desc    Get tracking history for a shipment
// @access  Public
router.get('/:trackingNumber', getTracking);

// @route   POST /api/tracking
// @desc    Add a tracking event (the required REST endpoint)
// @access  Private
router.post('/', protect, updateTracking);

// @route   POST /api/tracking/update (legacy alias)
// @access  Private
router.post('/update', protect, updateTracking);

module.exports = router;
