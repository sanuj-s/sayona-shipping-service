// ─────────────────────────────────────────────
// Public API helper — Sayona Shipping
// Connects to the backend REST API for tracking,
// shipment creation, and authentication
// ─────────────────────────────────────────────
const API_BASE = '/api/v1';

/**
 * Safely escape HTML to prevent XSS
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Unwrap v1 API response envelope { success, data }
 */
function unwrapResponse(json) {
    if (json && json.data !== undefined) return json.data;
    return json;
}

/**
 * Fetch tracking details and history from PostgreSQL
 * @param {string} trackingId 
 * @returns {Promise<Object>} shipment + history timeline
 */
async function getTracking(trackingId) {
    const response = await fetch(`${API_BASE}/tracking/${encodeURIComponent(trackingId)}`);
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || err.message || 'Tracking ID not found');
    }
    const json = await response.json();
    return unwrapResponse(json);
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
        throw new Error(err.error?.message || err.message || 'Failed to create shipment');
    }
    const json = await response.json();
    return unwrapResponse(json);
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
        throw new Error(err.error?.message || err.message || 'Invalid credentials');
    }
    const json = await response.json();
    return unwrapResponse(json);
}

async function submitContact(data) {
    const response = await fetch(`${API_BASE}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || err.message || 'Failed to submit contact form');
    }
    const json = await response.json();
    return unwrapResponse(json);
}

window.api = { getTracking, createShipment, loginUser, submitContact, escapeHtml };
