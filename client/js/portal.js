// ─── Client Portal API Helper ───
const API_BASE = '/api';

const PortalAPI = {
    getToken: () => localStorage.getItem('client_token'),
    getUser: () => JSON.parse(localStorage.getItem('client_user') || 'null'),

    setAuth: (data) => {
        localStorage.setItem('client_token', data.token);
        localStorage.setItem('client_user', JSON.stringify({
            id: data._id || data.id,
            name: data.name,
            email: data.email,
            role: data.role,
        }));
    },

    clearAuth: () => {
        localStorage.removeItem('client_token');
        localStorage.removeItem('client_user');
    },

    request: async (endpoint, options = {}) => {
        const token = PortalAPI.getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers: { ...headers, ...options.headers },
            });

            const data = await res.json();
            if (!res.ok) {
                if (res.status === 401) {
                    PortalAPI.clearAuth();
                    window.location.href = '/client/login.html';
                    return;
                }
                throw new Error(data.message || 'Request failed');
            }
            return data;
        } catch (err) {
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

    // Shipments
    getShipments: () => PortalAPI.request('/shipments'),
    createShipment: (data) => PortalAPI.request('/shipments', {
        method: 'POST', body: JSON.stringify(data)
    }),
    getShipment: (tracking) => PortalAPI.request(`/shipments/${tracking}`),

    // Tracking
    getTracking: (tracking) => PortalAPI.request(`/tracking/${tracking}`),
};

// ─── Toast Notifications ───
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

// ─── Init Sidebar User ───
function initSidebar() {
    const user = PortalAPI.getUser();
    if (!user) return;

    const nameEl = document.getElementById('sidebarUserName');
    const emailEl = document.getElementById('sidebarUserEmail');
    const avatarEl = document.getElementById('sidebarAvatar');
    const logoutBtn = document.getElementById('logoutBtn');

    if (nameEl) nameEl.textContent = user.name;
    if (emailEl) emailEl.textContent = user.email;
    if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            PortalAPI.clearAuth();
            window.location.href = '/client/login.html';
        });
    }

    // Highlight active nav
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// ─── Status badge helper ───
function statusBadge(status) {
    const s = (status || '').toLowerCase().replace(/\s+/g, '-');
    const cls = s.includes('delivered') ? 'delivered'
        : s.includes('transit') ? 'transit'
            : s.includes('picked') ? 'picked-up'
                : 'pending';
    return `<span class="badge badge-${cls}">${status}</span>`;
}

function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}
