const express = require('express');
const router = express.Router();
const {
    createShipment,
    getShipments,
    getShipmentByTrackingNumber,
    updateShipment,
    deleteShipment,
    generateInvoice
} = require('../controllers/shipmentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createShipment)
    .get(protect, getShipments);

router.route('/:trackingNumber')
    .get(getShipmentByTrackingNumber)
    .put(protect, updateShipment)
    .delete(protect, admin, deleteShipment);

router.route('/:trackingNumber/invoice')
    .get(protect, generateInvoice);

module.exports = router;
