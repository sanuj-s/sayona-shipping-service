const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, getAnalytics, getUsers } = require('../controllers/adminAuthController');
const { createShipment, getShipments, getShipmentByTrackingNumber, updateShipment, deleteShipment } = require('../controllers/shipmentController');
const { getTracking, updateTracking } = require('../controllers/trackingController');
const { getContacts, markContactRead } = require('../controllers/contactController');
const { getQuotes, updateQuoteStatus } = require('../controllers/quoteController');
const { protectAdmin } = require('../middleware/adminMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Auth
router.post('/login', authLimiter, loginAdmin);
router.get('/profile', protectAdmin, getAdminProfile);

// Analytics
router.get('/analytics', protectAdmin, getAnalytics);

// Shipments (reuses existing controllers)
router.get('/shipments', protectAdmin, getShipments);
router.post('/shipments', protectAdmin, createShipment);
router.get('/shipments/:trackingNumber', protectAdmin, getShipmentByTrackingNumber);
router.put('/shipments/:trackingNumber', protectAdmin, updateShipment);
router.delete('/shipments/:trackingNumber', protectAdmin, deleteShipment);

// Tracking
router.get('/tracking/:trackingNumber', protectAdmin, getTracking);
router.post('/tracking', protectAdmin, updateTracking);

// Users
router.get('/users', protectAdmin, getUsers);

// Contacts
router.get('/contacts', protectAdmin, getContacts);
router.put('/contacts/:id/read', protectAdmin, markContactRead);

// Quotes
router.get('/quotes', protectAdmin, getQuotes);
router.put('/quotes/:id/status', protectAdmin, updateQuoteStatus);

module.exports = router;
