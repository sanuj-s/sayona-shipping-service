// Users management page

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    initAdminUI();
    loadUsers();

    const searchInput = document.getElementById('searchInput');

    if (searchInput) searchInput.addEventListener('input', debounce(filterUsers, 300));
});

let allUsers = [];

async function loadUsers() {
    const tbody = document.getElementById('usersBody');
    tbody.innerHTML = '<tr><td colspan="5"><div class="spinner"></div></td></tr>';

    try {
        allUsers = await apiRequest('/users');
        renderUsers(allUsers);
    } catch (error) {
        showToast('Failed to load users: ' + error.message, 'error');
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><p>Failed to load</p></td></tr>';
    }
}

function filterUsers() {
    const query = (document.getElementById('searchInput').value || '').toLowerCase();

    let filtered = allUsers;

    if (query) {
        filtered = filtered.filter(u =>
            (u.name || '').toLowerCase().includes(query) ||
            (u.email || '').toLowerCase().includes(query) ||
            (u.company || '').toLowerCase().includes(query)
        );
    }

    renderUsers(filtered);
}

function renderUsers(users) {
    const tbody = document.getElementById('usersBody');
    const countEl = document.getElementById('userCount');

    if (countEl) countEl.textContent = `${users.length} user${users.length !== 1 ? 's' : ''}`;

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state"><div class="empty-icon">👥</div><p>No users found</p></td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${formatDate(u.created_at || u.createdAt)}</td>
            <td>
                <strong>${u.name}</strong>
                <div style="font-size: 0.85em; color: var(--text-muted);"><a href="mailto:${u.email}">${u.email}</a></div>
                <div style="font-size: 0.85em; color: var(--text-muted);">${u.phone || ''}</div>
            </td>
            <td>${u.company || '—'}</td>
            <td><span class="badge ${u.role === 'admin' ? 'badge-delivered' : 'badge-transit'}">${u.role || 'client'}</span></td>
            <td>
                <span style="color: #94a3b8; font-size: 0.85em;">View Only</span>
            </td>
        </tr>
    `).join('');
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
