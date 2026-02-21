const Shipment = require('../models/Shipment');
const Tracking = require('../models/Tracking');

// @desc    Create a new shipment
// @route   POST /api/shipments
// @access  Private
const createShipment = async (req, res) => {
    try {
        const { trackingNumber, senderName, senderAddress, receiverName, receiverAddress, currentLocation } = req.body;

        if (!trackingNumber || !senderName || !senderAddress || !receiverName || !receiverAddress || !currentLocation) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const shipmentExists = await Shipment.findOne({ trackingNumber });
        if (shipmentExists) {
            return res.status(400).json({ message: 'Shipment with this tracking number already exists' });
        }

        const shipment = await Shipment.create({
            trackingNumber,
            senderName,
            senderAddress,
            receiverName,
            receiverAddress,
            currentLocation,
            status: 'Pending'
        });

        // Create initial tracking history
        await Tracking.create({
            trackingNumber,
            location: currentLocation,
            status: 'Pending',
            timestamp: Date.now()
        });

        res.status(201).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private
const getShipments = async (req, res) => {
    try {
        const shipments = await Shipment.find().sort({ createdAt: -1 });
        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shipment by tracking number
// @route   GET /api/shipments/:trackingNumber
// @access  Private
const getShipmentByTrackingNumber = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update shipment status/location
// @route   PUT /api/shipments/:trackingNumber
// @access  Private
const updateShipment = async (req, res) => {
    try {
        const { status, currentLocation } = req.body;
        const trackingNumber = req.params.trackingNumber;

        const shipment = await Shipment.findOne({ trackingNumber });

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        if (status) shipment.status = status;
        if (currentLocation) shipment.currentLocation = currentLocation;

        const updatedShipment = await shipment.save();

        // Create new tracking history entry if location or status is updated
        if (status || currentLocation) {
            await Tracking.create({
                trackingNumber,
                location: shipment.currentLocation,
                status: shipment.status,
                timestamp: Date.now()
            });
        }

        res.status(200).json(updatedShipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:trackingNumber
// @access  Private/Admin
const deleteShipment = async (req, res) => {
    try {
        const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        await Shipment.deleteOne({ trackingNumber: req.params.trackingNumber });
        await Tracking.deleteMany({ trackingNumber: req.params.trackingNumber });

        res.status(200).json({ message: 'Shipment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createShipment,
    getShipments,
    getShipmentByTrackingNumber,
    updateShipment,
    deleteShipment
};
