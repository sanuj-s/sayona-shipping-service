// ─────────────────────────────────────────────
// Auth Controller — HTTP handlers for authentication
// Thin layer: validation → service → response
// ─────────────────────────────────────────────
const AuthService = require('../services/auth.service');
const TokenService = require('../services/token.service');
const { success, created } = require('../utils/responseHelper');
const { AUDIT_ACTIONS } = require('../models/schemas');
const config = require('../config/environment');

const register = async (req, res, next) => {
    try {
        const result = await AuthService.register(req.body);

        await req.audit(AUDIT_ACTIONS.USER_REGISTER, 'user', null, null, {
            email: result.user.email,
            role: result.user.role,
        });

        const response = {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        };

        // Include verification token in non-production
        if (!config.isProduction()) {
            response.verificationToken = result.verificationToken;
        }

        return created(res, response);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await AuthService.login(req.body.email, req.body.password);

        await req.audit(AUDIT_ACTIONS.USER_LOGIN, 'user', null, null, {
            email: result.user.email,
        });

        return success(res, {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const tokens = await TokenService.refreshAccessToken(req.body.refreshToken);
        return success(res, tokens);
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        await AuthService.logout(req.body.refreshToken);

        await req.audit(AUDIT_ACTIONS.USER_LOGOUT, 'user', null, null, null);

        return success(res, { message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await AuthService.getProfile(req.user.id);
        return success(res, user);
    } catch (error) {
        next(error);
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const oldUser = await AuthService.getProfile(req.user.id);
        const updated = await AuthService.updateProfile(req.user.id, req.body);

        await req.audit(AUDIT_ACTIONS.USER_UPDATED, 'user', req.user.id, oldUser, updated);

        return success(res, updated);
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const result = await AuthService.requestPasswordReset(req.body.email);

        await req.audit(AUDIT_ACTIONS.PASSWORD_RESET_REQUESTED, 'user', null, null, {
            email: req.body.email,
        });

        const response = { message: result.message };
        // Include token in non-production for testing
        if (!config.isProduction() && result.resetToken) {
            response.resetToken = result.resetToken;
        }

        return success(res, response);
    } catch (error) {
        next(error);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const result = await AuthService.resetPassword(req.body.token, req.body.password);

        await req.audit(AUDIT_ACTIONS.PASSWORD_RESET_COMPLETED, 'user', null, null, null);

        return success(res, result);
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const result = await AuthService.verifyEmail(req.params.token);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    getMe,
    updateProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
};
