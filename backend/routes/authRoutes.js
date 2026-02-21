const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/auth/register
router.post('/register', registerUser);

// @route   POST /api/auth/login (rate-limited)
router.post('/login', authLimiter, loginUser);

// @route   GET /api/auth/me (get current user profile)
router.get('/me', protect, getMe);

module.exports = router;
