const Shipment = require('../models/Shipment');
const TrackingHistory = require('../models/TrackingHistory');

// @desc    Get tracking history and shipment info
// @route   GET /api/tracking/:trackingNumber
// @access  Public
const getTracking = async (req, res) => {
    try {
        const trackingNumber = req.params.trackingNumber;

        const shipment = await Shipment.findOne({ trackingNumber });

        if (!shipment) {
            return res.status(404).json({ message: 'Tracking number not found' });
        }

        const history = await TrackingHistory.find({ trackingNumber }).sort({ timestamp: -1 });

        res.status(200).json({
            shipment: {
                trackingNumber: shipment.trackingNumber,
                senderName: shipment.senderName,
                receiverName: shipment.receiverName,
                status: shipment.status,
                currentLocation: shipment.currentLocation,
            },
            history
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a tracking update manually (if needed outside of shipment update)
// @route   POST /api/tracking/update
// @access  Private
const updateTracking = async (req, res) => {
    try {
        const { trackingNumber, location, status } = req.body;

        if (!trackingNumber || !location || !status) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const shipment = await Shipment.findOne({ trackingNumber });
        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        shipment.status = status;
        shipment.currentLocation = location;
        await shipment.save();

        const trackingRecord = await TrackingHistory.create({
            trackingNumber,
            location,
            status,
            timestamp: Date.now()
        });

        res.status(201).json(trackingRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTracking,
    updateTracking
};
