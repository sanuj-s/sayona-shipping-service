// ─────────────────────────────────────────────
// Shipment Routes — /api/v1/shipments
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const shipmentController = require('../../controllers/shipment.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { authorize, authorizeMinRole } = require('../../middlewares/authorize');
const validate = require('../../middlewares/validate');
const shipmentValidator = require('../../validators/shipment.validator');
const { USER_ROLES } = require('../../models/schemas');

// All routes require authentication
router.use(authenticate);

// List shipments (all roles — service handles role-based filtering)
router.get('/', validate(shipmentValidator.getShipments), shipmentController.getShipments);

// Create shipment (staff+ only)
router.post('/', authorizeMinRole(USER_ROLES.STAFF), validate(shipmentValidator.createShipment), shipmentController.createShipment);

// Get single shipment by UUID
router.get('/:uuid', validate(shipmentValidator.uuidParam), shipmentController.getShipmentByUuid);

// Update shipment (staff+ only)
router.put('/:uuid', authorizeMinRole(USER_ROLES.STAFF), validate(shipmentValidator.updateShipment), shipmentController.updateShipment);

// Delete (soft) shipment (admin only)
router.delete('/:uuid', authorize(USER_ROLES.ADMIN), validate(shipmentValidator.uuidParam), shipmentController.deleteShipment);

module.exports = router;
