// ─────────────────────────────────────────────
// Warehouse Controller — HTTP handlers for warehouses
// ─────────────────────────────────────────────
const WarehouseService = require('../services/warehouse.service');
const { success, created, paginated } = require('../utils/responseHelper');
const { parsePagination } = require('../utils/pagination');

const mapWarehouse = (w) => ({
    uuid: w.uuid,
    name: w.name,
    location: w.location,
    capacity: w.capacity,
    createdAt: w.created_at,
    updatedAt: w.updated_at,
});

const listWarehouses = async (req, res, next) => {
    try {
        const pagination = parsePagination(req.query, ['created_at', 'name']);
        const result = await WarehouseService.getAll(pagination);

        return paginated(res, result.data.map(mapWarehouse), {
            page: pagination.page,
            limit: pagination.limit,
            total: result.total,
        });
    } catch (error) {
        next(error);
    }
};

const getWarehouse = async (req, res, next) => {
    try {
        const warehouse = await WarehouseService.getByUuid(req.params.uuid);
        return success(res, mapWarehouse(warehouse));
    } catch (error) {
        next(error);
    }
};

const createWarehouse = async (req, res, next) => {
    try {
        const warehouse = await WarehouseService.create(req.body);
        return created(res, mapWarehouse(warehouse));
    } catch (error) {
        next(error);
    }
};

const updateWarehouse = async (req, res, next) => {
    try {
        const warehouse = await WarehouseService.update(req.params.uuid, req.body);
        return success(res, mapWarehouse(warehouse));
    } catch (error) {
        next(error);
    }
};

const deleteWarehouse = async (req, res, next) => {
    try {
        const result = await WarehouseService.delete(req.params.uuid);
        return success(res, result);
    } catch (error) {
        next(error);
    }
};

module.exports = { listWarehouses, getWarehouse, createWarehouse, updateWarehouse, deleteWarehouse };
