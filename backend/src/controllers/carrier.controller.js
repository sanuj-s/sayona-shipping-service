// ─────────────────────────────────────────────
// Carrier Controller — HTTP handlers for carriers
// ─────────────────────────────────────────────
const CarrierService = require('../services/carrier.service');
const { success, created, paginated } = require('../utils/responseHelper');
const { parsePagination } = require('../utils/pagination');

const mapCarrier = (c) => ({
    uuid: c.uuid,
    name: c.name,
    serviceType: c.service_type,
    contact: c.contact,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
});

const listCarriers = async (req, res, next) => {
    try {
        const pagination = parsePagination(req.query, ['created_at', 'name']);
        const result = await CarrierService.getAll(pagination);

        return paginated(res, result.data.map(mapCarrier), {
            page: pagination.page,
            limit: pagination.limit,
            total: result.total,
        });
    } catch (error) {
        next(error);
    }
};

const getCarrier = async (req, res, next) => {
    try {
        const carrier = await CarrierService.getByUuid(req.params.uuid);
        return success(res, mapCarrier(carrier));
    } catch (error) {
        next(error);
    }
};

const createCarrier = async (req, res, next) => {
    try {
        const carrier = await CarrierService.create(req.body);
        return created(res, mapCarrier(carrier));
    } catch (error) {
        next(error);
    }
};

const updateCarrier = async (req, res, next) => {
    try {
        const carrier = await CarrierService.update(req.params.uuid, req.body);
        return success(res, mapCarrier(carrier));
    } catch (error) {
        next(error);
    }
};

const deleteCarrier = async (req, res, next) => {
    try {
        const result = await CarrierService.delete(req.params.uuid);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

module.exports = { listCarriers, getCarrier, createCarrier, updateCarrier, deleteCarrier };
