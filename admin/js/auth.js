// Auth guard and login/logout logic — adapted for enterprise v1 API

function requireAuth() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = '/admin/login.html';
        return false;
    }
    return true;
}

function logout() {
    const refreshToken = localStorage.getItem('admin_refresh_token');
    if (refreshToken) {
        fetch('/api/v1/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
            },
            body: JSON.stringify({ refreshToken }),
        }).catch(() => { });
    }

    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    localStorage.removeItem('admin_refresh_token');
    window.location.href = '/admin/login.html';
}

function getAdminName() {
    return localStorage.getItem('admin_name') || 'Admin';
}

// Set admin name in topbar — active-state logic is now in sidebar.js
function initAdminUI() {
    const nameEl = document.getElementById('adminName');
    if (nameEl) {
        nameEl.textContent = getAdminName();
    }
    // NOTE: Logout button wiring and active-state nav highlighting
    // are handled by sidebar.js loadSidebar() — not here.
}

// Login form handler
function initLoginForm() {
    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');

    if (!form) return;

    if (localStorage.getItem('admin_token')) {
        window.location.href = '/admin/dashboard.html';
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!email || !password) {
            errorEl.textContent = 'Please enter email and password';
            errorEl.classList.add('show');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';
        errorEl.classList.remove('show');

        try {
            const data = await loginAPI(email, password);

            if (data.user && data.user.role !== 'admin' && data.user.role !== 'staff') {
                errorEl.textContent = 'Access denied. Admin or staff account required.';
                errorEl.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
                return;
            }

            localStorage.setItem('admin_token', data.accessToken);
            localStorage.setItem('admin_name', data.user?.name || 'Admin');
            if (data.refreshToken) {
                localStorage.setItem('admin_refresh_token', data.refreshToken);
            }

            window.location.href = '/admin/dashboard.html';
        } catch (err) {
            errorEl.textContent = err.message || 'Login failed';
            errorEl.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    });
}
