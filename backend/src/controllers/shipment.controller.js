// ─────────────────────────────────────────────
// Shipment Controller — HTTP handlers for shipments
// ─────────────────────────────────────────────
const ShipmentService = require('../services/shipment.service');
const UserRepository = require('../repositories/user.repository');
const { success, created, paginated } = require('../utils/responseHelper');
const { parsePagination } = require('../utils/pagination');
const { AUDIT_ACTIONS } = require('../models/schemas');
const { NotFoundError } = require('../utils/AppError');

const createShipment = async (req, res, next) => {
    try {
        let userId = req.user.id;

        // If staff/admin is creating for a client via email
        if (req.body.userEmail && (req.user.role === 'admin' || req.user.role === 'staff')) {
            const linkedUser = await UserRepository.findByEmail(req.body.userEmail);
            if (!linkedUser) throw new NotFoundError('User with provided email');
            userId = linkedUser.id;
        }

        const shipment = await ShipmentService.create({
            ...req.body,
            userId,
            origin: req.body.origin,
            destination: req.body.destination,
            createdBy: req.user.id,
        });

        await req.audit(AUDIT_ACTIONS.SHIPMENT_CREATED, 'shipment', null, null, {
            trackingNumber: shipment.trackingNumber,
        });

        return created(res, shipment);
    } catch (error) {
        next(error);
    }
};

const getShipments = async (req, res, next) => {
    try {
        const pagination = parsePagination(req.query, ['created_at', 'updated_at', 'status']);
        const filters = {
            status: req.query.status,
            industryType: req.query.industryType,
            search: req.query.search,
        };

        let result;
        if (req.user.role === 'admin' || req.user.role === 'staff') {
            result = await ShipmentService.getAll(pagination, filters);
        } else {
            result = await ShipmentService.getByUserId(req.user.id, pagination);
        }

        return paginated(res, result.data, {
            page: pagination.page,
            limit: pagination.limit,
            total: result.total,
        });
    } catch (error) {
        next(error);
    }
};

const getShipmentByUuid = async (req, res, next) => {
    try {
        const shipment = await ShipmentService.getByUuid(req.params.uuid);
        return success(res, shipment);
    } catch (error) {
        next(error);
    }
};

const updateShipment = async (req, res, next) => {
    try {
        const result = await ShipmentService.updateStatus(
            req.params.uuid,
            req.body,
            req.user.id
        );

        await req.audit(AUDIT_ACTIONS.SHIPMENT_UPDATED, 'shipment', null, null, {
            uuid: req.params.uuid,
            status: req.body.status,
        });

        return success(res, result);
    } catch (error) {
        next(error);
    }
};

const deleteShipment = async (req, res, next) => {
    try {
        const result = await ShipmentService.softDelete(req.params.uuid);

        await req.audit(AUDIT_ACTIONS.SHIPMENT_DELETED, 'shipment', null, null, {
            uuid: req.params.uuid,
        });

        return success(res, result);
    } catch (error) {
        next(error);
    }
};

module.exports = { createShipment, getShipments, getShipmentByUuid, updateShipment, deleteShipment };
