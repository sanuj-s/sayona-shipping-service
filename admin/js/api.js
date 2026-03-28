// ─────────────────────────────────────
// Centralized API + Utilities for Admin Panel
// Enterprise v1 API
// ─────────────────────────────────────
const AUTH_API = '/api/v1/auth';
const ADMIN_API = '/api/v1/admin';
const SHIPMENTS_API = '/api/v1/shipments';
const TRACKING_API = '/api/v1/tracking';
const QUOTES_API = '/api/v1/quotes';

// ─────────── XSS Protection ───────────
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

// ─────────── Shared Utilities ───────────
function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function getStatusClass(status) {
    if (!status) return 'created';
    const s = status.toLowerCase().replace(/[_\s]+/g, '-');
    if (s.includes('pending') || s.includes('created')) return 'created';
    if (s.includes('picked')) return 'picked';
    if (s.includes('warehouse')) return 'warehouse';
    if (s.includes('out-for-delivery')) return 'out-delivery';
    if (s.includes('transit') || s.includes('shipped')) return 'transit';
    if (s.includes('deliver')) return 'delivered';
    if (s.includes('fail')) return 'failed';
    if (s.includes('return')) return 'returned';
    if (s.includes('cancel')) return 'cancelled';
    return 'created';
}

// ─────────── Skeleton Loader Helper ───────────
function renderSkeletonRows(colCount, rowCount = 5) {
    const widths = ['30%', '55%', '45%', '60%', '35%', '50%', '40%', '25%'];
    let rows = '';
    for (let r = 0; r < rowCount; r++) {
        let cells = '';
        for (let c = 0; c < colCount; c++) {
            const w = widths[(r + c) % widths.length];
            cells += `<td><div class="skeleton skeleton-text" style="width:${w}"></div></td>`;
        }
        rows += `<tr class="skeleton-row">${cells}</tr>`;
    }
    return rows;
}

// ─────────── Empty State Helper ───────────
function renderEmptyState(colCount, icon, title, subtitle, ctaText, ctaHref) {
    let cta = '';
    if (ctaText && ctaHref) {
        cta = `<a href="${escapeHtml(ctaHref)}" class="btn btn-primary btn-sm" style="margin-top:12px;">${escapeHtml(ctaText)}</a>`;
    }
    return `<tr><td colspan="${colCount}" class="empty-state">
        <div class="empty-icon">${icon}</div>
        <p class="empty-title">${escapeHtml(title)}</p>
        <p class="empty-subtitle">${escapeHtml(subtitle)}</p>
        ${cta}
    </td></tr>`;
}

// ─────────── Auth Helpers ───────────
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
        const errMsg = json.error?.message || json.message || 'API request failed';
        throw new Error(errMsg);
    }

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

// ─────────── Shipments (Paginated) ───────────
async function getShipments(params = {}) {
    const defaults = { page: 1, limit: 20 };
    const merged = { ...defaults, ...params };
    const query = new URLSearchParams();

    if (merged.page) query.set('page', merged.page);
    if (merged.limit) query.set('limit', merged.limit);
    if (merged.status) query.set('status', merged.status);
    if (merged.search) query.set('search', merged.search);
    if (merged.industryType) query.set('industryType', merged.industryType);
    if (merged.sort) query.set('sort', merged.sort);
    if (merged.order) query.set('order', merged.order);

    const result = await apiRequest(`${SHIPMENTS_API}?${query.toString()}`);
    // Return full result so caller can access pagination metadata
    return result;
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
    const trackingData = await apiRequest(`${TRACKING_API}/${trackingNumber}`);
    const uuid = trackingData.shipment?.uuid;
    if (!uuid) throw new Error('Shipment not found');

    return apiRequest(`${SHIPMENTS_API}/${uuid}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

async function deleteShipmentAPI(trackingNumber) {
    const trackingData = await apiRequest(`${TRACKING_API}/${trackingNumber}`);
    const uuid = trackingData.shipment?.uuid;
    if (!uuid) throw new Error('Shipment not found');

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

// ─────────── Users (Paginated) ───────────
async function getUsersAPI(params = {}) {
    const defaults = { page: 1, limit: 20 };
    const merged = { ...defaults, ...params };
    const query = new URLSearchParams();
    if (merged.page) query.set('page', merged.page);
    if (merged.limit) query.set('limit', merged.limit);
    if (merged.search) query.set('search', merged.search);

    const result = await apiRequest(`${ADMIN_API}/users?${query.toString()}`);
    return result;
}

// ─────────── Contacts (Paginated) ───────────
async function getContactsAPI(params = {}) {
    const defaults = { page: 1, limit: 20 };
    const merged = { ...defaults, ...params };
    const query = new URLSearchParams();
    if (merged.page) query.set('page', merged.page);
    if (merged.limit) query.set('limit', merged.limit);
    if (merged.search) query.set('search', merged.search);

    const result = await apiRequest(`${ADMIN_API}/contacts?${query.toString()}`);
    return result;
}

async function markContactReadAPI(uuid) {
    return apiRequest(`${ADMIN_API}/contacts/${uuid}/read`, {
        method: 'PUT',
    });
}

// ─────────── Quotes (Paginated) ───────────
async function getQuotesAPI(params = {}) {
    const defaults = { page: 1, limit: 20 };
    const merged = { ...defaults, ...params };
    const query = new URLSearchParams();
    if (merged.page) query.set('page', merged.page);
    if (merged.limit) query.set('limit', merged.limit);
    if (merged.search) query.set('search', merged.search);
    if (merged.status) query.set('status', merged.status);

    const result = await apiRequest(`${QUOTES_API}?${query.toString()}`);
    return result;
}

async function updateQuoteStatusAPI(uuid, status) {
    return apiRequest(`${QUOTES_API}/${uuid}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    });
}

// ─────────── Pagination UI Helper ───────────
function renderPaginationUI(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    if (totalPages <= 1) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'pagination';

    // Prev button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-outline btn-sm';
    prevBtn.textContent = '← Prev';
    prevBtn.disabled = currentPage <= 1;
    prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));
    wrapper.appendChild(prevBtn);

    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.className = 'pagination-info';
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    wrapper.appendChild(pageInfo);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-outline btn-sm';
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));
    wrapper.appendChild(nextBtn);

    container.appendChild(wrapper);
}

// ─────────── Toast Notifications (Safe) ───────────
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
    const iconSpan = document.createElement('span');
    iconSpan.textContent = icons[type] || 'ℹ';

    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(msgSpan);
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
