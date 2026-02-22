// ─────────────────────────────────────────────
// Model Schemas — Shared enums, constants, field definitions
// ─────────────────────────────────────────────

/**
 * Shipment status lifecycle
 */
const SHIPMENT_STATUS = Object.freeze({
    CREATED: 'CREATED',
    IN_TRANSIT: 'IN_TRANSIT',
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
});

const SHIPMENT_STATUS_VALUES = Object.values(SHIPMENT_STATUS);

/**
 * Valid shipment status transitions
 */
const SHIPMENT_STATUS_TRANSITIONS = Object.freeze({
    [SHIPMENT_STATUS.CREATED]: [SHIPMENT_STATUS.IN_TRANSIT, SHIPMENT_STATUS.CANCELLED],
    [SHIPMENT_STATUS.IN_TRANSIT]: [SHIPMENT_STATUS.OUT_FOR_DELIVERY, SHIPMENT_STATUS.CANCELLED],
    [SHIPMENT_STATUS.OUT_FOR_DELIVERY]: [SHIPMENT_STATUS.DELIVERED, SHIPMENT_STATUS.IN_TRANSIT],
    [SHIPMENT_STATUS.DELIVERED]: [],
    [SHIPMENT_STATUS.CANCELLED]: [],
});

/**
 * User roles hierarchy
 */
const USER_ROLES = Object.freeze({
    ADMIN: 'admin',
    STAFF: 'staff',
    CLIENT: 'client',
});

const USER_ROLE_VALUES = Object.values(USER_ROLES);

/**
 * Role hierarchy for authorization — higher index = more privilege
 */
const ROLE_HIERARCHY = Object.freeze({
    [USER_ROLES.CLIENT]: 0,
    [USER_ROLES.STAFF]: 1,
    [USER_ROLES.ADMIN]: 2,
});

/**
 * Quote statuses
 */
const QUOTE_STATUS = Object.freeze({
    PENDING: 'pending',
    REVIEWED: 'reviewed',
    QUOTED: 'quoted',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
});

const QUOTE_STATUS_VALUES = Object.values(QUOTE_STATUS);

/**
 * Audit log action types
 */
const AUDIT_ACTIONS = Object.freeze({
    USER_LOGIN: 'USER_LOGIN',
    USER_REGISTER: 'USER_REGISTER',
    USER_LOGOUT: 'USER_LOGOUT',
    USER_UPDATED: 'USER_UPDATED',
    USER_LOCKED: 'USER_LOCKED',
    USER_UNLOCKED: 'USER_UNLOCKED',
    PASSWORD_RESET_REQUESTED: 'PASSWORD_RESET_REQUESTED',
    PASSWORD_RESET_COMPLETED: 'PASSWORD_RESET_COMPLETED',
    SHIPMENT_CREATED: 'SHIPMENT_CREATED',
    SHIPMENT_UPDATED: 'SHIPMENT_UPDATED',
    SHIPMENT_DELETED: 'SHIPMENT_DELETED',
    TRACKING_EVENT_ADDED: 'TRACKING_EVENT_ADDED',
    QUOTE_SUBMITTED: 'QUOTE_SUBMITTED',
    QUOTE_STATUS_UPDATED: 'QUOTE_STATUS_UPDATED',
    CONTACT_SUBMITTED: 'CONTACT_SUBMITTED',
    CONTACT_READ: 'CONTACT_READ',
});

module.exports = {
    SHIPMENT_STATUS,
    SHIPMENT_STATUS_VALUES,
    SHIPMENT_STATUS_TRANSITIONS,
    USER_ROLES,
    USER_ROLE_VALUES,
    ROLE_HIERARCHY,
    QUOTE_STATUS,
    QUOTE_STATUS_VALUES,
    AUDIT_ACTIONS,
};
