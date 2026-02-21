const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
        const admin = result.rows[0];

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
        const totalResult = await pool.query('SELECT COUNT(*) as count FROM shipments');
        const total = parseInt(totalResult.rows[0].count);

        const statusResult = await pool.query(
            "SELECT status, COUNT(*) as count FROM shipments GROUP BY status"
        );

        const statusCounts = {};
        statusResult.rows.forEach(row => {
            statusCounts[row.status] = parseInt(row.count);
        });

        const recentResult = await pool.query(
            'SELECT * FROM shipments ORDER BY created_at DESC LIMIT 10'
        );

        const recentShipments = recentResult.rows.map(row => ({
            id: row.id,
            trackingNumber: row.tracking_id,
            senderName: row.sender_name,
            receiverName: row.receiver_name,
            origin: row.origin,
            destination: row.destination,
            status: row.status,
            createdAt: row.created_at
        }));

        const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
        const totalUsers = parseInt(usersResult.rows[0].count);

        res.json({
            totalShipments: total,
            statusCounts,
            recentShipments,
            totalUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
const getUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    loginAdmin,
    getAdminProfile,
    getAnalytics,
    getUsers,
};
