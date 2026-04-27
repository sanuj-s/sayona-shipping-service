// ─────────────────────────────────────────────
// Carrier Routes — /api/v1/carriers
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const carrierController = require('../../controllers/carrier.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { authorize } = require('../../middlewares/authorize');
const validate = require('../../middlewares/validate');
const carrierValidator = require('../../validators/carrier.validator');
const { USER_ROLES } = require('../../models/schemas');

// All routes require authentication + admin role
router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN));

router.get('/', carrierController.listCarriers);
router.get('/:uuid', validate(carrierValidator.uuidParam), carrierController.getCarrier);
router.post('/', validate(carrierValidator.createCarrier), carrierController.createCarrier);
router.put('/:uuid', validate(carrierValidator.updateCarrier), carrierController.updateCarrier);
router.delete('/:uuid', validate(carrierValidator.uuidParam), carrierController.deleteCarrier);

module.exports = router;
