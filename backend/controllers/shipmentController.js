// ─────────────────────────────────────────────
// Shipment Controller — HTTP handlers for shipments
// Uses: ShipmentService → Shipment/Tracking Models → DB
// ─────────────────────────────────────────────
const ShipmentService = require('../services/shipmentService');

// @desc    Create a new shipment
// @route   POST /api/shipments
// @access  Private
const createShipment = async (req, res) => {
    try {
        const { trackingNumber, senderName, senderAddress, receiverName, receiverAddress, currentLocation } = req.body;

        if (!trackingNumber || !senderName || !senderAddress || !receiverName || !receiverAddress || !currentLocation) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const shipment = await ShipmentService.create({
            trackingNumber, senderName, senderAddress, receiverName, receiverAddress, currentLocation,
        });

        res.status(201).json(shipment);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc    Get all shipments (with optional filter)
// @route   GET /api/shipments
// @access  Public
const getShipments = async (req, res) => {
    try {
        const shipments = await ShipmentService.getAll(req.query.industry);
        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shipment by tracking number
// @route   GET /api/shipments/:trackingNumber
// @access  Public
const getShipmentByTrackingNumber = async (req, res) => {
    try {
        const shipment = await ShipmentService.getByTrackingNumber(req.params.trackingNumber);
        res.status(200).json(shipment);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc    Update shipment status/location
// @route   PUT /api/shipments/:trackingNumber
// @access  Private
const updateShipment = async (req, res) => {
    try {
        const result = await ShipmentService.update(req.params.trackingNumber, req.body);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:trackingNumber
// @access  Private/Admin
const deleteShipment = async (req, res) => {
    try {
        const result = await ShipmentService.delete(req.params.trackingNumber);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

module.exports = { createShipment, getShipments, getShipmentByTrackingNumber, updateShipment, deleteShipment };
