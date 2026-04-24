// ─────────────────────────────────────────────
// Tenant Routes — /api/v1/tenants
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const tenantController = require('../../controllers/tenant.controller');
const { authenticate } = require('../../middlewares/authenticate');

// Protected routes
router.use(authenticate);

router.get('/usage', tenantController.getUsage);
router.post('/upgrade-plan', tenantController.upgradePlan);

module.exports = router;
