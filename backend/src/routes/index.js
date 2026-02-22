// ─────────────────────────────────────────────
// Route Aggregator — Mounts all v1 routes
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();

// v1 routes
const authRoutes = require('./v1/auth.routes');
const shipmentRoutes = require('./v1/shipment.routes');
const trackingRoutes = require('./v1/tracking.routes');
const quoteRoutes = require('./v1/quote.routes');
const contactRoutes = require('./v1/contact.routes');
const adminRoutes = require('./v1/admin.routes');

// Mount v1
router.use('/v1/auth', authRoutes);
router.use('/v1/shipments', shipmentRoutes);
router.use('/v1/tracking', trackingRoutes);
router.use('/v1/quotes', quoteRoutes);
router.use('/v1/contacts', contactRoutes);
router.use('/v1/admin', adminRoutes);

module.exports = router;
