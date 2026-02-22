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
        const { trackingNumber, senderName, senderAddress, receiverName, receiverAddress, currentLocation, industryType } = req.body;

        if (!trackingNumber || !senderName || !senderAddress || !receiverName || !receiverAddress || !currentLocation) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        let userId = req.user ? req.user.id : null;

        // If admin is creating the shipment, try to link it to a user via email
        if (req.admin && req.body.userEmail) {
            const User = require('../models/User'); // Import dynamically or at top
            const linkedUser = await User.findByEmail(req.body.userEmail);
            if (linkedUser) {
                userId = linkedUser.id;
            } else {
                return res.status(404).json({ message: 'User with provided email not found' });
            }
        }

        const shipment = await ShipmentService.create({
            trackingNumber, senderName, senderAddress, receiverName, receiverAddress, currentLocation, industryType, userId
        });

        res.status(201).json(shipment);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc    Get all shipments (role-based: admin gets all, client gets theirs)
// @route   GET /api/shipments
// @access  Private
const getShipments = async (req, res) => {
    try {
        let shipments;
        if (req.admin || (req.user && req.user.role === 'admin')) {
            shipments = await ShipmentService.getAll(req.query.industry);
        } else {
            shipments = await ShipmentService.getByUserId(req.user.id);
        }
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

// @desc    Generate invoice (mock)
// @route   GET /api/shipments/:trackingNumber/invoice
// @access  Private
const generateInvoice = async (req, res) => {
    try {
        const shipment = await ShipmentService.getByTrackingNumber(req.params.trackingNumber);

        const isAdmin = req.admin || (req.user && req.user.role === 'admin');
        const isOwner = req.user && shipment.userId === req.user.id;

        if (!isAdmin && !isOwner) {
            return res.status(403).json({ message: 'Not authorized to view this invoice' });
        }

        const escapeHTML = (str) => {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        };

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
                    .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, .15); }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3730a3; padding-bottom: 20px; margin-bottom: 20px; }
                    .header h1 { color: #3730a3; margin: 0; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                    .total { text-align: right; font-size: 1.5em; font-weight: bold; color: #3730a3; margin-top: 30px; border-top: 2px solid #eee; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="invoice-box">
                    <div class="header">
                        <h1>SAYONA LOGISTICS</h1>
                        <div>
                            <strong>INVOICE</strong><br>
                            Tracking: #${escapeHTML(shipment.trackingNumber)}<br>
                            Date: ${new Date().toLocaleDateString()}
                        </div>
                    </div>
                    <div class="info-grid">
                        <div>
                            <strong>Sender Details:</strong><br>
                            ${escapeHTML(shipment.senderName)}<br>
                            ${escapeHTML(shipment.origin)}
                        </div>
                        <div>
                            <strong>Receiver Details:</strong><br>
                            ${escapeHTML(shipment.receiverName)}<br>
                            ${escapeHTML(shipment.destination)}
                        </div>
                    </div>
                    <table style="width: 100%; text-align: left; border-collapse: collapse;">
                        <tr style="background: #f8f9fa;">
                            <th style="padding: 10px; border: 1px solid #ddd;">Description</th>
                            <th style="padding: 10px; border: 1px solid #ddd;">Amount</th>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">Freight Charges (${escapeHTML(shipment.industryType) || 'General'})</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">To Be Calculated</td>
                        </tr>
                    </table>
                    <div class="total">Total Due: TBD</div>
                    <p style="text-align: center; color: #777; margin-top: 40px; font-size: 0.9em;">
                        Thank you for your business. Payment is due within 30 days.
                    </p>
                </div>
            </body>
            </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

module.exports = { createShipment, getShipments, getShipmentByTrackingNumber, updateShipment, deleteShipment, generateInvoice };
