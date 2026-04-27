// ─────────────────────────────────────────────
// Warehouse Service — Business logic for warehouses
// ─────────────────────────────────────────────
const WarehouseRepository = require('../repositories/warehouse.repository');
const { NotFoundError } = require('../utils/AppError');

const WarehouseService = {
    create: async (data) => {
        return WarehouseRepository.create(data);
    },

    getAll: async (pagination) => {
        const [rows, total] = await Promise.all([
            WarehouseRepository.findAll(pagination),
            WarehouseRepository.countAll(),
        ]);
        return { data: rows, total };
    },

    getByUuid: async (uuid) => {
        const warehouse = await WarehouseRepository.findByUuid(uuid);
        if (!warehouse) throw new NotFoundError('Warehouse');
        return warehouse;
    },

    update: async (uuid, data) => {
        const warehouse = await WarehouseRepository.findByUuid(uuid);
        if (!warehouse) throw new NotFoundError('Warehouse');
        return WarehouseRepository.update(warehouse.id, data);
    },

    delete: async (uuid) => {
        const warehouse = await WarehouseRepository.findByUuid(uuid);
        if (!warehouse) throw new NotFoundError('Warehouse');
        await WarehouseRepository.delete(warehouse.id);
        return { message: 'Warehouse deleted' };
    },
};

module.exports = WarehouseService;
