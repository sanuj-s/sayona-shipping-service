// ─────────────────────────────────────────────
// Admin Routes — /api/v1/admin
// All routes require admin role
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const contactController = require('../../controllers/contact.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { authorize, authorizeMinRole } = require('../../middlewares/authorize');
const validate = require('../../middlewares/validate');
const contactValidator = require('../../validators/contact.validator');
const { USER_ROLES } = require('../../models/schemas');

// All admin routes require authentication
router.use(authenticate);

// Admin-only routes
router.get('/dashboard', authorize(USER_ROLES.ADMIN), adminController.getDashboard);
router.get('/users', authorize(USER_ROLES.ADMIN), adminController.getUsers);
router.put('/users/:uuid', authorize(USER_ROLES.ADMIN), adminController.updateUser);
router.get('/audit-logs', authorize(USER_ROLES.ADMIN), adminController.getAuditLogs);

// Staff+ routes
router.get('/contacts', authorizeMinRole(USER_ROLES.STAFF), validate(contactValidator.getContacts), contactController.getContacts);
router.put('/contacts/:uuid/read', authorizeMinRole(USER_ROLES.STAFF), validate(contactValidator.uuidParam), contactController.markContactRead);

module.exports = router;
