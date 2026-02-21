// Centralized API helper for the admin panel
const API_BASE = '/api/admin';

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

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
        headers: authHeaders(),
        ...options,
    };

    const response = await fetch(url, config);

    if (response.status === 401) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_name');
        window.location.href = '/admin/login.html';
        throw new Error('Unauthorized');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
}

// Auth
async function loginAPI(email, password) {
    return apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

async function getProfile() {
    return apiRequest('/profile');
}

// Analytics
async function getAnalytics() {
    return apiRequest('/analytics');
}

// Shipments
async function getShipments() {
    return apiRequest('/shipments');
}

async function getShipment(trackingNumber) {
    return apiRequest(`/shipments/${trackingNumber}`);
}

async function createShipmentAPI(data) {
    return apiRequest('/shipments', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

async function updateShipmentAPI(trackingNumber, data) {
    return apiRequest(`/shipments/${trackingNumber}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function deleteShipmentAPI(trackingNumber) {
    return apiRequest(`/shipments/${trackingNumber}`, {
        method: 'DELETE',
    });
}

// Tracking
async function getTrackingHistory(trackingNumber) {
    return apiRequest(`/tracking/${trackingNumber}`);
}

async function addTrackingEvent(data) {
    return apiRequest('/tracking', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// Users
async function getUsersAPI() {
    return apiRequest('/users');
}

// Toast notifications
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
