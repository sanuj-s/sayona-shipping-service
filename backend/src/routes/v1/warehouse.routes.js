// ─────────────────────────────────────────────
// Warehouse Routes — /api/v1/warehouses
// ─────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const warehouseController = require('../../controllers/warehouse.controller');
const { authenticate } = require('../../middlewares/authenticate');
const { authorize } = require('../../middlewares/authorize');
const validate = require('../../middlewares/validate');
const warehouseValidator = require('../../validators/warehouse.validator');
const { USER_ROLES } = require('../../models/schemas');

// All routes require authentication + admin role
router.use(authenticate);
router.use(authorize(USER_ROLES.ADMIN));

router.get('/', warehouseController.listWarehouses);
router.get('/:uuid', validate(warehouseValidator.uuidParam), warehouseController.getWarehouse);
router.post('/', validate(warehouseValidator.createWarehouse), warehouseController.createWarehouse);
router.put('/:uuid', validate(warehouseValidator.updateWarehouse), warehouseController.updateWarehouse);
router.delete('/:uuid', validate(warehouseValidator.uuidParam), warehouseController.deleteWarehouse);

module.exports = router;
