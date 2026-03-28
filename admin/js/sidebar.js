// ─────────────────────────────────────
// Sidebar Component Loader
// Loads shared sidebar HTML, sets active state,
// handles mobile hamburger toggle
// ─────────────────────────────────────

async function loadSidebar() {
    const mount = document.getElementById('sidebar-mount');
    if (!mount) return;

    try {
        const res = await fetch('/admin/components/sidebar.html');
        if (!res.ok) throw new Error('Failed to load sidebar');
        const html = await res.text();
        mount.innerHTML = html;
    } catch (err) {
        // Fallback: render a minimal sidebar
        mount.innerHTML = `<aside class="sidebar"><div class="sidebar-brand"><h2>Sayona Shipping</h2></div></aside>`;
    }

    // Set active state based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPage) {
            link.classList.add('active');
        }
    });

    // Wire up logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Set admin name
    const nameEl = document.getElementById('adminName');
    if (nameEl) {
        nameEl.textContent = getAdminName();
    }

    // Mobile hamburger setup
    setupMobileMenu();
}

function setupMobileMenu() {
    const sidebar = document.getElementById('adminSidebar');
    if (!sidebar) return;

    // Create hamburger button if it doesn't exist
    let hamburger = document.getElementById('sidebarToggle');
    if (!hamburger) {
        hamburger = document.createElement('button');
        hamburger.id = 'sidebarToggle';
        hamburger.className = 'sidebar-toggle';
        hamburger.setAttribute('aria-label', 'Toggle sidebar');
        hamburger.innerHTML = '☰';

        // Insert at start of topbar
        const topbar = document.querySelector('.topbar');
        if (topbar) {
            topbar.insertBefore(hamburger, topbar.firstChild);
        }
    }

    // Create overlay
    let overlay = document.getElementById('sidebarOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    // Toggle handlers
    hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        hamburger.innerHTML = sidebar.classList.contains('open') ? '✕' : '☰';
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
        hamburger.innerHTML = '☰';
    });

    // Close sidebar on nav link click (mobile)
    sidebar.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
                hamburger.innerHTML = '☰';
            }
        });
    });
}
