// ─────────────────────────────────────────────
// Authorization Middleware — Role-Based Access Control
// ─────────────────────────────────────────────
const { AuthorizationError } = require('../utils/AppError');
const { ROLE_HIERARCHY } = require('../models/schemas');

/**
 * Restrict access to specific roles
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'staff')
 * @returns {Function} Express middleware
 *
 * Usage: authorize('admin', 'staff')
 * This allows both admin and staff roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AuthorizationError('Authentication required'));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new AuthorizationError(
                    `Role '${req.user.role}' is not authorized to access this resource`
                )
            );
        }

        next();
    };
};

/**
 * Restrict access to users with at least the given role level
 * Uses the role hierarchy: client < staff < admin
 * @param {string} minRole - Minimum required role
 * @returns {Function} Express middleware
 */
const authorizeMinRole = (minRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AuthorizationError('Authentication required'));
        }

        const userLevel = ROLE_HIERARCHY[req.user.role] ?? -1;
        const minLevel = ROLE_HIERARCHY[minRole] ?? 999;

        if (userLevel < minLevel) {
            return next(
                new AuthorizationError(
                    `Insufficient permissions. Minimum role required: ${minRole}`
                )
            );
        }

        next();
    };
};

module.exports = { authorize, authorizeMinRole };
