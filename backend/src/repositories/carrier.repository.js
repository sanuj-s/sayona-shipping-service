// ─────────────────────────────────────────────
// Carrier Repository — DB abstraction for carriers table
// ─────────────────────────────────────────────
const { query } = require('../config/database');

const CarrierRepository = {
    create: async ({ name, serviceType, contact }) => {
        const result = await query(
            `INSERT INTO carriers (name, service_type, contact)
             VALUES ($1, $2, $3) RETURNING *`,
            [name, serviceType, contact]
        );
        return result.rows[0];
    },

    findAll: async ({ limit, offset, sortBy = 'created_at', sortOrder = 'DESC' }) => {
        const result = await query(
            `SELECT * FROM carriers ORDER BY ${sortBy} ${sortOrder} LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows[0] ? result.rows : []; // return empty array if no rows
    },

    findByUuid: async (uuid) => {
        const result = await query(
            'SELECT * FROM carriers WHERE uuid = $1',
            [uuid]
        );
        return result.rows[0] || null;
    },

    update: async (id, { name, serviceType, contact }) => {
        const result = await query(
            `UPDATE carriers SET name = COALESCE($1, name), service_type = COALESCE($2, service_type), contact = COALESCE($3, contact)
             WHERE id = $4 RETURNING *`,
            [name, serviceType, contact, id]
        );
        return result.rows[0] || null;
    },

    delete: async (id) => {
        const result = await query(
            'DELETE FROM carriers WHERE id = $1 RETURNING id, uuid, name',
            [id]
        );
        return result.rows[0] || null;
    },

    countAll: async () => {
        const result = await query('SELECT COUNT(*) as count FROM carriers');
        return parseInt(result.rows[0].count, 10);
    },
};

module.exports = CarrierRepository;
