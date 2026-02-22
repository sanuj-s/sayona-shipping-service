// ─────────────────────────────────────
// Centralized API helper for the admin panel
// Adapted for Enterprise v1 API
// ─────────────────────────────────────
const AUTH_API = '/api/v1/auth';
const ADMIN_API = '/api/v1/admin';
const SHIPMENTS_API = '/api/v1/shipments';
const TRACKING_API = '/api/v1/tracking';
const QUOTES_API = '/api/v1/quotes';

function getToken() {
    return localStorage.getItem('admin_token');
}

function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

/**
 * Core API request — auto-unwraps { success, data } envelope
 */
async function apiRequest(url, options = {}) {
    const config = {
        headers: authHeaders(),
        ...options,
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        localStorage.removeItem('admin_refresh_token');
        window.location.href = '/admin/login.html';
        throw new Error('Unauthorized');
    }

    const json = await response.json();

    if (!response.ok) {
        // Handle new error envelope: { success: false, error: { code, message } }
        const errMsg = json.error?.message || json.message || 'API request failed';
        throw new Error(errMsg);
    }

    // Unwrap the response envelope — return data directly
    return json.data !== undefined ? json.data : json;
}

// ─────────── Auth ───────────
async function loginAPI(email, password) {
    return apiRequest(`${AUTH_API}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

async function getProfile() {
    return apiRequest(`${AUTH_API}/me`);
}

// ─────────── Dashboard / Analytics ───────────
async function getAnalytics() {
    return apiRequest(`${ADMIN_API}/dashboard`);
}

// ─────────── Shipments ───────────
async function getShipments() {
    const result = await apiRequest(`${SHIPMENTS_API}?limit=100`);
    return result.data || result;
}

async function getShipment(trackingNumber) {
    return apiRequest(`${TRACKING_API}/${trackingNumber}`);
}

async function createShipmentAPI(data) {
    return apiRequest(SHIPMENTS_API, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function updateShipmentAPI(trackingNumber, data) {
    // New API uses UUID for updates — look up shipment first to get UUID
    const trackingData = await apiRequest(`${TRACKING_API}/${trackingNumber}`);
    const uuid = trackingData.shipment?.uuid;

    if (!uuid) {
        throw new Error('Shipment not found');
    }

    return apiRequest(`${SHIPMENTS_API}/${uuid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function deleteShipmentAPI(trackingNumber) {
    // New API uses UUID for deletes — look up shipment first
    const trackingData = await apiRequest(`${TRACKING_API}/${trackingNumber}`);
    const uuid = trackingData.shipment?.uuid;

    if (!uuid) {
        throw new Error('Shipment not found');
    }

    return apiRequest(`${SHIPMENTS_API}/${uuid}`, {
        method: 'DELETE',
    });
}

// ─────────── Tracking ───────────
async function getTrackingHistory(trackingNumber) {
    return apiRequest(`${TRACKING_API}/${trackingNumber}`);
}

async function addTrackingEvent(data) {
    return apiRequest(TRACKING_API, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ─────────── Users ───────────
async function getUsersAPI() {
    const result = await apiRequest(`${ADMIN_API}/users?limit=100`);
    return result.data || result;
}

// ─────────── Contacts ───────────
async function getContactsAPI() {
    const result = await apiRequest(`${ADMIN_API}/contacts?limit=100`);
    return result.data || result;
}

async function markContactReadAPI(uuid) {
    return apiRequest(`${ADMIN_API}/contacts/${uuid}/read`, {
        method: 'PUT',
    });
}

// ─────────── Quotes ───────────
async function getQuotesAPI() {
    const result = await apiRequest(`${QUOTES_API}?limit=100`);
    return result.data || result;
}

async function updateQuoteStatusAPI(uuid, status) {
    return apiRequest(`${QUOTES_API}/${uuid}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

// ─────────── Toast Notifications ───────────
function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${message}`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
