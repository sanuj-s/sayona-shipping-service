// ─────────────────────────────────────────────
// Public API helper — Sayona Shipping
// Connects to the backend REST API for tracking,
// shipment creation, and authentication
// ─────────────────────────────────────────────
const API_BASE = '/api';

/**
 * Fetch tracking details and history from PostgreSQL
 * @param {string} trackingId 
 * @returns {Promise<Object>} shipment + history timeline
 */
async function getTracking(trackingId) {
    const response = await fetch(`${API_BASE}/tracking/${trackingId}`);
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Tracking ID not found');
    }
    return response.json();
}

/**
 * Create a new shipment
 */
async function createShipment(data) {
    const response = await fetch(`${API_BASE}/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to create shipment');
    }
    return response.json();
}

/**
 * Authenticate user
 */
async function loginUser(data) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Invalid credentials');
    }
    return response.json();
}

window.api = { getTracking, createShipment, loginUser };
