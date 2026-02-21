const express = require('express');
const router = express.Router();
const { getTracking, updateTracking } = require('../controllers/trackingController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/tracking/:trackingNumber
// @access  Public
router.get('/:trackingNumber', getTracking);

// @route   POST /api/tracking/update
// @access  Private
router.post('/update', protect, updateTracking);

module.exports = router;
