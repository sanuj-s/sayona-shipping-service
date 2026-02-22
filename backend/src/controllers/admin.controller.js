// ─────────────────────────────────────────────
// Admin Controller — HTTP handlers for admin panel
// ─────────────────────────────────────────────
const ShipmentService = require('../services/shipment.service');
const AuditService = require('../services/audit.service');
const UserRepository = require('../repositories/user.repository');
const { success, paginated } = require('../utils/responseHelper');
const { parsePagination } = require('../utils/pagination');
const { NotFoundError, ValidationError } = require('../utils/AppError');
const { USER_ROLE_VALUES, AUDIT_ACTIONS } = require('../models/schemas');

const getDashboard = async (req, res, next) => {
    try {
        const analytics = await ShipmentService.getAnalytics();
        const totalUsers = await UserRepository.countAll();

        return success(res, {
            ...analytics,
            totalUsers,
        });
    } catch (error) {
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const pagination = parsePagination(req.query, ['created_at', 'name', 'email', 'role']);
        const users = await UserRepository.findAll(pagination);
        const total = await UserRepository.countAll();

        return paginated(res, users.map((u) => ({
            uuid: u.uuid,
            name: u.name,
            email: u.email,
            phone: u.phone,
            company: u.company,
            role: u.role,
            isVerified: u.is_verified,
            isLocked: u.is_locked,
            createdAt: u.created_at,
            updatedAt: u.updated_at,
        })), {
            page: pagination.page,
            limit: pagination.limit,
            total,
        });
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await UserRepository.findByUuid(req.params.uuid);
        if (!user) throw new NotFoundError('User');

        const { role, isLocked } = req.body;

        if (role) {
            if (!USER_ROLE_VALUES.includes(role)) {
                throw new ValidationError(`Invalid role. Must be one of: ${USER_ROLE_VALUES.join(', ')}`);
            }
            await UserRepository.updateRole(user.id, role);
        }

        if (isLocked === true) {
            await UserRepository.lockAccount(user.id, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)); // 1 year
            await req.audit(AUDIT_ACTIONS.USER_LOCKED, 'user', user.id, null, { uuid: req.params.uuid });
        } else if (isLocked === false) {
            await UserRepository.unlockAccount(user.id);
            await req.audit(AUDIT_ACTIONS.USER_UNLOCKED, 'user', user.id, null, { uuid: req.params.uuid });
        }

        const updated = await UserRepository.findByUuid(req.params.uuid);

        await req.audit(AUDIT_ACTIONS.USER_UPDATED, 'user', user.id, { role: user.role }, { role: updated.role });

        return success(res, {
            uuid: updated.uuid,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            isLocked: updated.is_locked,
            updatedAt: updated.updated_at,
        });
    } catch (error) {
        next(error);
    }
};

const getAuditLogs = async (req, res, next) => {
    try {
        const pagination = parsePagination(req.query, ['created_at']);
        const filters = {
            action: req.query.action,
            entityType: req.query.entityType,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };

        const result = await AuditService.getAll(pagination, filters);

        return paginated(res, result.data, {
            page: pagination.page,
            limit: pagination.limit,
            total: result.total,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDashboard, getUsers, updateUser, getAuditLogs };
