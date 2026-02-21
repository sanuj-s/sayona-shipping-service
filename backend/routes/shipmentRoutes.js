const express = require('express');
const router = express.Router();
const {
    createShipment,
    getShipments,
    getShipmentByTrackingNumber,
    updateShipment,
    deleteShipment
} = require('../controllers/shipmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createShipment)
    .get(getShipments);

router.route('/:trackingNumber')
    .get(getShipmentByTrackingNumber)
    .put(protect, updateShipment)
    .delete(protect, admin, deleteShipment);

module.exports = router;
