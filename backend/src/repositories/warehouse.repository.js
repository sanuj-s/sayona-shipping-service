// ─────────────────────────────────────────────
// Warehouse Repository — DB abstraction for warehouses table
// ─────────────────────────────────────────────
const { query } = require('../config/database');

const WarehouseRepository = {
    create: async ({ name, location, capacity }) => {
        const result = await query(
            `INSERT INTO warehouses (name, location, capacity)
             VALUES ($1, $2, $3) RETURNING *`,
            [name, location, capacity || 0]
        );
        return result.rows[0];
    },

    findAll: async ({ limit, offset, sortBy = 'created_at', sortOrder = 'DESC' }) => {
        const result = await query(
            `SELECT * FROM warehouses ORDER BY ${sortBy} ${sortOrder} LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    },

    findByUuid: async (uuid) => {
        const result = await query(
            'SELECT * FROM warehouses WHERE uuid = $1',
            [uuid]
        );
        return result.rows[0] || null;
    },

    update: async (id, { name, location, capacity }) => {
        const result = await query(
            `UPDATE warehouses SET name = COALESCE($1, name), location = COALESCE($2, location), capacity = COALESCE($3, capacity)
             WHERE id = $4 RETURNING *`,
            [name, location, capacity, id]
        );
        return result.rows[0] || null;
    },

    delete: async (id) => {
        const result = await query(
            'DELETE FROM warehouses WHERE id = $1 RETURNING id, uuid, name',
            [id]
        );
        return result.rows[0] || null;
    },

    countAll: async () => {
        const result = await query('SELECT COUNT(*) as count FROM warehouses');
        return parseInt(result.rows[0].count, 10);
    },
};

module.exports = WarehouseRepository;
