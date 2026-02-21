// ─────────────────────────────────────────────
// Admin Auth Controller — HTTP handlers for admin panel
// Uses: Admin Model → DB, ShipmentService, User Model
// ─────────────────────────────────────────────
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Shipment = require('../models/Shipment');
const User = require('../models/User');

// Generate JWT for admin
const generateAdminToken = (id) => {
    return jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const admin = await Admin.findByEmail(email);
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            token: generateAdminToken(admin.id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private (admin)
const getAdminProfile = async (req, res) => {
    res.json(req.admin);
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (admin)
const getAnalytics = async (req, res) => {
    try {
        const totalShipments = await Shipment.countAll();
        const statusCounts = await Shipment.countByStatus();
        const recentRows = await Shipment.findRecent(10);

        const recentShipments = recentRows.map(row => ({
            id: row.id,
            trackingNumber: row.tracking_id,
            senderName: row.sender_name,
            receiverName: row.receiver_name,
            origin: row.origin,
            destination: row.destination,
            status: row.status,
            createdAt: row.created_at,
        }));

        const users = await User.findAll();
        const totalUsers = users.length;

        res.json({ totalShipments, statusCounts, recentShipments, totalUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginAdmin, getAdminProfile, getAnalytics, getUsers };
