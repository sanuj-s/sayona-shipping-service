// Auth guard and login/logout logic

function requireAuth() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
        window.location.href = '/admin/login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    window.location.href = '/admin/login.html';
}

function getAdminName() {
    return localStorage.getItem('admin_name') || 'Admin';
}

// Set admin name in topbar
function initAdminUI() {
    const nameEl = document.getElementById('adminName');
    if (nameEl) {
        nameEl.textContent = getAdminName();
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Highlight current nav item
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentPage)) {
            link.classList.add('active');
        }
    });
}

// Login form handler
function initLoginForm() {
    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');

    if (!form) return;

    // If already logged in, redirect
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
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_name', data.name);
            window.location.href = '/admin/dashboard.html';
        } catch (err) {
            errorEl.textContent = err.message || 'Login failed';
            errorEl.classList.add('show');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    });
}
