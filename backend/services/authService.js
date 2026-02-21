// ─────────────────────────────────────────────
// Auth Service — Business logic for authentication
// ─────────────────────────────────────────────
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SALT_ROUNDS = 10;

const AuthService = {
    // Hash a password
    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return bcrypt.hash(password, salt);
    },

    // Compare password with hash
    comparePassword: async (password, hash) => {
        return bcrypt.compare(password, hash);
    },

    // Generate JWT token for user
    generateToken: (id, role) => {
        return jwt.sign({ id, role }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
    },

    // Register a new user
    register: async ({ name, email, password, phone, company, role }) => {
        if (await User.emailExists(email)) {
            throw Object.assign(new Error('User already exists'), { statusCode: 400 });
        }

        const hashedPassword = await AuthService.hashPassword(password);
        const user = await User.create({
            name, email, password: hashedPassword, phone, company, role,
        });

        return {
            ...user,
            token: AuthService.generateToken(user.id, user.role),
        };
    },

    // Login a user
    login: async (email, password) => {
        const user = await User.findByEmail(email);

        if (!user || !(await AuthService.comparePassword(password, user.password))) {
            throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: AuthService.generateToken(user.id, user.role),
        };
    },
};

module.exports = AuthService;
