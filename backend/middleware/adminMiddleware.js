const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protectAdmin = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch admin from admins table
            const result = await pool.query(
                'SELECT id, name, email FROM admins WHERE id = $1',
                [decoded.id]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ message: 'Not authorized, admin not found' });
            }

            req.admin = result.rows[0];
            next();
        } catch (error) {
            console.error('Admin auth error:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protectAdmin };
