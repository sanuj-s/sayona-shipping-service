// ─────────────────────────────────────────────
// Carrier Service — Business logic for carriers
// ─────────────────────────────────────────────
const CarrierRepository = require('../repositories/carrier.repository');
const { NotFoundError } = require('../utils/AppError');

const CarrierService = {
    create: async (data) => {
        return CarrierRepository.create({
             name: data.name,
             serviceType: data.serviceType,
             contact: data.contact,
        });
    },

    getAll: async (pagination) => {
        const [rows, total] = await Promise.all([
            CarrierRepository.findAll(pagination),
            CarrierRepository.countAll(),
        ]);
        return { data: rows, total };
    },

    getByUuid: async (uuid) => {
        const carrier = await CarrierRepository.findByUuid(uuid);
        if (!carrier) throw new NotFoundError('Carrier');
        return carrier;
    },

    update: async (uuid, data) => {
        const carrier = await CarrierRepository.findByUuid(uuid);
        if (!carrier) throw new NotFoundError('Carrier');
        return CarrierRepository.update(carrier.id, {
             name: data.name,
             serviceType: data.serviceType,
             contact: data.contact,
        });
    },

    delete: async (uuid) => {
        const carrier = await CarrierRepository.findByUuid(uuid);
        if (!carrier) throw new NotFoundError('Carrier');
        await CarrierRepository.delete(carrier.id);
        return { message: 'Carrier deleted' };
    },
};

module.exports = CarrierService;
