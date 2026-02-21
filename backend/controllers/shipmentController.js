const pool = require('../config/db');

// @desc    Create a new shipment
// @route   POST /api/shipments
// @access  Private
const createShipment = async (req, res) => {
    try {
        const { trackingNumber, senderName, senderAddress, receiverName, receiverAddress, currentLocation } = req.body;

        if (!trackingNumber || !senderName || !senderAddress || !receiverName || !receiverAddress || !currentLocation) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const shipmentExists = await pool.query('SELECT * FROM shipments WHERE tracking_id = $1', [trackingNumber]);
        if (shipmentExists.rows.length > 0) {
            return res.status(400).json({ message: 'Shipment with this tracking number already exists' });
        }

        // Inserting mapping senderAddress->origin, receiverAddress->destination
        const insertShipmentQuery = `
            INSERT INTO shipments (tracking_id, sender_name, receiver_name, origin, destination, status)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const result = await pool.query(insertShipmentQuery, [
            trackingNumber,
            senderName,
            receiverName,
            senderAddress,
            receiverAddress,
            'Pending'
        ]);
        const shipment = result.rows[0];

        // Create initial tracking history
        await pool.query(
            `INSERT INTO tracking (tracking_id, location, status) VALUES ($1, $2, $3)`,
            [trackingNumber, currentLocation, 'Pending']
        );

        // Map returning shipment back to camelCase to not break frontend immediately if it relies on it (optional, but requested output specifies returning shipment)
        res.status(201).json({
            id: shipment.id,
            trackingNumber: shipment.tracking_id,
            senderName: shipment.sender_name,
            senderAddress: shipment.origin,
            receiverName: shipment.receiver_name,
            receiverAddress: shipment.destination,
            status: shipment.status,
            currentLocation,
            createdAt: shipment.created_at
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private
const getShipments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shipments ORDER BY created_at DESC');
        // Optional mapping loop to CamelCase here if requested, but assuming frontend depends on tracking fields directly from getTracking so returning rows should suffice mostly
        // Safest approach is mapping back trackingNumber at least
        const mappedShipments = result.rows.map(row => ({
            id: row.id,
            trackingNumber: row.tracking_id,
            senderName: row.sender_name,
            origin: row.origin,
            destination: row.destination,
            receiverName: row.receiver_name,
            status: row.status,
            createdAt: row.created_at
        }));

        res.status(200).json(mappedShipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shipment by tracking number
// @route   GET /api/shipments/:trackingNumber
// @access  Private
const getShipmentByTrackingNumber = async (req, res) => {
    try {
        const trackingNumber = req.params.trackingNumber;
        const result = await pool.query('SELECT * FROM shipments WHERE tracking_id = $1', [trackingNumber]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        const shipment = result.rows[0];

        // Let's deduce currentLocation from tracking table to append to the shipment
        const locationResult = await pool.query('SELECT location FROM tracking WHERE tracking_id = $1 ORDER BY timestamp DESC LIMIT 1', [trackingNumber]);
        const currentLocation = locationResult.rows.length > 0 ? locationResult.rows[0].location : 'Unknown';

        res.status(200).json({
            id: shipment.id,
            trackingNumber: shipment.tracking_id,
            senderName: shipment.sender_name,
            origin: shipment.origin,
            destination: shipment.destination,
            receiverName: shipment.receiver_name,
            status: shipment.status,
            currentLocation,
            createdAt: shipment.created_at
        });
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

        const shipmentCheck = await pool.query('SELECT * FROM shipments WHERE tracking_id = $1', [trackingNumber]);

        if (shipmentCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        let updateStatus = shipmentCheck.rows[0].status;

        // If status is provided, update shipment table
        if (status) {
            await pool.query('UPDATE shipments SET status = $1 WHERE tracking_id = $2', [status, trackingNumber]);
            updateStatus = status;
        }

        let updateLocation = currentLocation || 'Unknown';

        // Create new tracking history entry if location or status is updated
        if (status || currentLocation) {
            await pool.query(
                'INSERT INTO tracking (tracking_id, location, status) VALUES ($1, $2, $3)',
                [trackingNumber, updateLocation, updateStatus]
            );
        }

        res.status(200).json({ message: 'Shipment updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:trackingNumber
// @access  Private/Admin
const deleteShipment = async (req, res) => {
    try {
        const trackingNumber = req.params.trackingNumber;
        const shipmentCheck = await pool.query('SELECT id FROM shipments WHERE tracking_id = $1', [trackingNumber]);

        if (shipmentCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Deleting from shipments automatically cascades to tracking due to FOREIGN KEY ON DELETE CASCADE
        await pool.query('DELETE FROM shipments WHERE tracking_id = $1', [trackingNumber]);

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
