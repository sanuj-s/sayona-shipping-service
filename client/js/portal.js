// ─── Client Portal API Helper — v1 API ───
const API_BASE = `${window.location.origin}/api/v1`;

// ─── XSS Protection ───
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

const PortalAPI = {
    getToken: () => localStorage.getItem('client_token'),
    getUser: () => JSON.parse(localStorage.getItem('client_user') || 'null'),

    setAuth: (data) => {
        const token = data.accessToken || data.token;
        localStorage.setItem('client_token', token);
        if (data.refreshToken) {
            localStorage.setItem('client_refresh_token', data.refreshToken);
        }
        const user = data.user || { name: data.name, email: data.email, role: data.role };
        localStorage.setItem('client_user', JSON.stringify({
            uuid: user.uuid || data._id || '',
            name: user.name,
            email: user.email,
            role: user.role || 'client',
        }));
    },

    clearAuth: () => {
        const refreshToken = localStorage.getItem('client_refresh_token');
        const token = localStorage.getItem('client_token');
        if (refreshToken && token) {
            fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ refreshToken }),
            }).catch(() => { });
        }

        localStorage.removeItem('client_token');
        localStorage.removeItem('client_user');
        localStorage.removeItem('client_refresh_token');
    },

    request: async (endpoint, options = {}, isRetry = false) => {
        let token = PortalAPI.getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers: { ...headers, ...options.headers },
            });

            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                if (res.status === 401 && !isRetry) {
                    const refreshToken = localStorage.getItem('client_refresh_token');
                    if (refreshToken) {
                        try {
                            const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ refreshToken })
                            });

                            if (refreshRes.ok) {
                                const refreshJson = await refreshRes.json();
                                const data = refreshJson.data || refreshJson;
                                PortalAPI.setAuth(data);
                                return PortalAPI.request(endpoint, options, true);
                            }
                        } catch (refreshErr) { }
                    }

                    PortalAPI.clearAuth();
                    window.location.href = '/client/login.html';
                    return;
                }

                let errorMsg = json.error?.message || json.message || 'Request failed';
                if (json.error?.details && json.error.details.length > 0) {
                    errorMsg += `: ${json.error.details[0].message}`;
                }
                throw new Error(errorMsg);
            }

            return json.data !== undefined ? json.data : json;
        } catch (err) {
            if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
                throw new Error('Cannot connect to the server. Please check your internet connection and try again.');
            }
            throw err;
        }
    },

    // Auth
    login: (email, password) => PortalAPI.request('/auth/login', {
        method: 'POST', body: JSON.stringify({ email, password }),
    }),

    register: (data) => PortalAPI.request('/auth/register', {
        method: 'POST', body: JSON.stringify(data),
    }),

    forgotPassword: (email) => PortalAPI.request('/auth/forgot-password', {
        method: 'POST', body: JSON.stringify({ email }),
    }),

    getProfile: () => PortalAPI.request('/auth/me'),

    updateProfile: (data) => PortalAPI.request('/auth/profile', {
        method: 'PUT', body: JSON.stringify(data)
    }),

    // Shipments (paginated)
    getShipments: async (params = {}) => {
        const defaults = { page: 1, limit: 20 };
        const merged = { ...defaults, ...params };
        const query = new URLSearchParams();
        if (merged.page) query.set('page', merged.page);
        if (merged.limit) query.set('limit', merged.limit);
        if (merged.status) query.set('status', merged.status);
        if (merged.search) query.set('search', merged.search);

        const result = await PortalAPI.request(`/shipments?${query.toString()}`);
        return result;
    },

    getShipment: (tracking) => PortalAPI.request(`/shipments/${tracking}`),

    // Tracking
    getTracking: (tracking) => PortalAPI.request(`/tracking/${tracking}`),

    // Create Shipment
    createShipment: (data) => PortalAPI.request('/shipments', {
        method: 'POST', body: JSON.stringify(data),
    }),

    // Secure invoice download (no JWT in URL)
    downloadInvoice: async (trackingNumber) => {
        const token = PortalAPI.getToken();
        const res = await fetch(`${API_BASE}/shipments/${encodeURIComponent(trackingNumber)}/invoice`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to download invoice');
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${trackingNumber}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
    },
};

// ─── Toast Notifications (Safe — no innerHTML) ───
function showToast(message, type = 'success') {
    const existing = document.querySelector('.cp-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `cp-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ─── Auth Guard ───
function requireAuth() {
    if (!PortalAPI.getToken()) {
        window.location.href = '/client/login.html';
        return false;
    }
    return true;
}

// ─── Sidebar Component Loader ───
// ALL sidebar logic lives here — active state, user info, logout.
async function loadClientSidebar() {
    const mount = document.getElementById('client-sidebar-mount');
    if (!mount) return;

    try {
        const res = await fetch('/client/components/sidebar.html');
        if (!res.ok) throw new Error('Failed');
        mount.innerHTML = await res.text();
    } catch (e) {
        mount.innerHTML = '<aside class="portal-sidebar"><div class="sidebar-brand"><h2>🚢 Sayona</h2></div></aside>';
    }

    // Populate user info synchronously from localStorage
    const user = PortalAPI.getUser();
    if (user) {
        const nameEl = document.getElementById('sidebarUserName');
        const emailEl = document.getElementById('sidebarUserEmail');
        const avatarEl = document.getElementById('sidebarAvatar');

        if (nameEl) nameEl.textContent = user.name || 'User';
        if (emailEl) emailEl.textContent = user.email || '';
        if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
    }

    // Logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            PortalAPI.clearAuth();
            window.location.href = '/client/login.html';
        });
    }

    // Active nav state
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ─── Status badge helper (XSS-safe) ───
function statusBadge(status) {
    const s = (status || '').toLowerCase().replace(/[_\s]+/g, '-');
    const cls = s.includes('delivered') ? 'delivered'
        : s.includes('transit') || s.includes('out-for') ? 'transit'
            : s.includes('created') ? 'pending'
                : s.includes('cancel') ? 'cancelled'
                    : 'pending';
    return `<span class="badge badge-${cls}">${escapeHtml(status)}</span>`;
}

function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

// ─── Pagination UI Helper (Client) ───
function renderClientPagination(containerId, currentPage, totalPages, onPageChange) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    if (totalPages <= 1) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'client-pagination';
    wrapper.style.cssText = 'display:flex; align-items:center; justify-content:center; gap:16px; margin-top:24px; padding:16px;';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn-portal';
    prevBtn.style.cssText = 'padding:8px 16px; font-size:0.85rem;';
    prevBtn.textContent = '← Prev';
    prevBtn.disabled = currentPage <= 1;
    prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));
    wrapper.appendChild(prevBtn);

    const info = document.createElement('span');
    info.style.cssText = 'color: var(--cp-text-muted); font-size:0.85rem;';
    info.textContent = `Page ${currentPage} of ${totalPages}`;
    wrapper.appendChild(info);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-portal';
    nextBtn.style.cssText = 'padding:8px 16px; font-size:0.85rem;';
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = currentPage >= totalPages;
    nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));
    wrapper.appendChild(nextBtn);

    container.appendChild(wrapper);
}
