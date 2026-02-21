// ─────────────────────────────────────────────
// Auth Controller — HTTP handlers for authentication
// Uses: AuthService → User Model → DB
// ─────────────────────────────────────────────
const AuthService = require('../services/authService');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, company, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const user = await AuthService.register({ name, email, password, phone, company, role });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: user.token,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await AuthService.login(email, password);

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: user.token,
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser };
