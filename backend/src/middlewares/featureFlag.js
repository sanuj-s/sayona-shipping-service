// ─────────────────────────────────────────────
// Feature Flag Middleware
// Blocks execution of incomplete/experimental API routes gracefully.
// ─────────────────────────────────────────────
const { AppError } = require('../utils/AppError');

// Hardcoded for now. In a true enterprise setup, this maps to LaunchDarkly or Redis.
const FEATURE_FLAGS = {
    'advanced-cmdk': false,
    'beta-dashboard': true
};

const requireFeatureFlag = (flagName) => {
    return (_req, _res, next) => {
        const isEnabled = FEATURE_FLAGS[flagName];
        
        if (!isEnabled) {
            return next(new AppError(`Feature '${flagName}' is currently disabled.`, 403, 'ERR_FEATURE_DISABLED'));
        }
        
        next();
    };
};

module.exports = { requireFeatureFlag, FEATURE_FLAGS };
