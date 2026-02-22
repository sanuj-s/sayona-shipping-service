// ─────────────────────────────────────────────
// Pagination Utility — Parse & build paginated queries
// ─────────────────────────────────────────────

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const ALLOWED_SORT_ORDERS = ['ASC', 'DESC'];

/**
 * Parse pagination params from query string
 * @param {object} query - req.query
 * @param {string[]} allowedSortFields - Whitelist of sortable columns
 * @returns {{ page, limit, offset, sortBy, sortOrder }}
 */
const parsePagination = (query = {}, allowedSortFields = ['created_at']) => {
    let page = parseInt(query.page, 10);
    let limit = parseInt(query.limit, 10);

    if (isNaN(page) || page < 1) page = DEFAULT_PAGE;
    if (isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;

    const offset = (page - 1) * limit;

    let sortBy = 'created_at';
    if (query.sortBy && allowedSortFields.includes(query.sortBy)) {
        sortBy = query.sortBy;
    }

    let sortOrder = 'DESC';
    if (query.sortOrder && ALLOWED_SORT_ORDERS.includes(query.sortOrder.toUpperCase())) {
        sortOrder = query.sortOrder.toUpperCase();
    }

    return { page, limit, offset, sortBy, sortOrder };
};

/**
 * Build SQL pagination clause
 * @param {{ sortBy, sortOrder, limit, offset }} pagination
 * @returns {string}
 */
const buildPaginationSQL = ({ sortBy, sortOrder, limit, offset }) => {
    return `ORDER BY ${sortBy} ${sortOrder} LIMIT ${limit} OFFSET ${offset}`;
};

module.exports = { parsePagination, buildPaginationSQL, DEFAULT_LIMIT, MAX_LIMIT };
