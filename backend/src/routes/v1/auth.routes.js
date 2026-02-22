// ─────────────────────────────────────────────
// Auth Routes — /api/v1/auth
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { authLimiter } = require('../../middlewares/rateLimiter');
const validate = require('../../middlewares/validate');
const authValidator = require('../../validators/auth.validator');

// Public routes (rate-limited)
router.post('/register', authLimiter, validate(authValidator.register), authController.register);
router.post('/login', authLimiter, validate(authValidator.login), authController.login);
router.post('/refresh', validate(authValidator.refreshToken), authController.refreshToken);
router.post('/forgot-password', authLimiter, validate(authValidator.forgotPassword), authController.forgotPassword);
router.post('/reset-password', validate(authValidator.resetPassword), authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, validate(authValidator.updateProfile), authController.updateProfile);
router.post('/logout', authenticate, validate(authValidator.logout), authController.logout);

module.exports = router;
