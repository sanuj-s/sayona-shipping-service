// Users management — XSS-safe, event delegation

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadSidebar();
    initAdminUI();
    loadUsers();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', debounce(filterUsers, 300));
});

let allUsers = [];

async function loadUsers() {
    const tbody = document.getElementById('usersBody');
    tbody.innerHTML = renderSkeletonRows(5, 5);

    try {
        const result = await getUsersAPI({ limit: 100 });
        allUsers = result.data || result;
        if (!Array.isArray(allUsers)) allUsers = [];
        renderUsers(allUsers);
    } catch (error) {
        showToast('Failed to load users: ' + error.message, 'error');
        tbody.innerHTML = renderEmptyState(5, '⚠️', 'Failed to load', 'Please try again later.');
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
        tbody.innerHTML = renderEmptyState(5, '👥', 'No users found', 'No registered users match your search criteria.');
        return;
    }

    tbody.innerHTML = users.map(u => `
        <tr>
            <td>${formatDate(u.createdAt)}</td>
            <td>
                <strong>${escapeHtml(u.name)}</strong>
                <div style="font-size: 0.85em; color: var(--text-muted);"><a href="mailto:${escapeHtml(u.email)}">${escapeHtml(u.email)}</a></div>
                <div style="font-size: 0.85em; color: var(--text-muted);">${escapeHtml(u.phone || '')}</div>
            </td>
            <td>${escapeHtml(u.company || '—')}</td>
            <td><span class="badge ${u.role === 'admin' ? 'badge-delivered' : u.role === 'staff' ? 'badge-transit' : 'badge-pending'}">${escapeHtml(u.role || 'client')}</span></td>
            <td>
                <span style="color: #94a3b8; font-size: 0.85em;">
                    ${u.isVerified ? '✅ Verified' : '⏳ Unverified'}
                    ${u.isLocked ? ' | 🔒 Locked' : ''}
                </span>
            </td>
        </tr>
    `).join('');
}
