// Contacts management page

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    initAdminUI();
    loadContacts();

    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) searchInput.addEventListener('input', debounce(filterContacts, 300));
    if (statusFilter) statusFilter.addEventListener('change', filterContacts);
});

let allContacts = [];
let currentContactId = null;

async function loadContacts() {
    const tbody = document.getElementById('contactsBody');
    tbody.innerHTML = '<tr><td colspan="5"><div class="spinner"></div></td></tr>';

    try {
        allContacts = await apiRequest('/contacts');
        renderContacts(allContacts);
    } catch (error) {
        showToast('Failed to load contacts: ' + error.message, 'error');
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state"><p>Failed to load</p></td></tr>';
    }
}

function filterContacts() {
    const query = (document.getElementById('searchInput').value || '').toLowerCase();
    const status = document.getElementById('statusFilter').value;

    let filtered = allContacts;

    if (query) {
        filtered = filtered.filter(c =>
            (c.name || '').toLowerCase().includes(query) ||
            (c.email || '').toLowerCase().includes(query) ||
            (c.subject || '').toLowerCase().includes(query)
        );
    }

    if (status) {
        const isRead = status === 'read';
        filtered = filtered.filter(c => c.is_read === isRead || c.isRead === isRead);
    }

    renderContacts(filtered);
}

function renderContacts(contacts) {
    const tbody = document.getElementById('contactsBody');
    const countEl = document.getElementById('contactCount');

    if (countEl) countEl.textContent = `${contacts.length} message${contacts.length !== 1 ? 's' : ''}`;

    if (contacts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state"><div class="empty-icon">💬</div><p>No contact messages found</p></td></tr>`;
        return;
    }

    tbody.innerHTML = contacts.map(c => {
        const isRead = c.is_read || c.isRead;
        return `
        <tr class="${isRead ? 'row-read' : 'row-unread'}">
            <td>${formatDate(c.created_at || c.createdAt)}</td>
            <td>
                <strong>${c.name}</strong>
                <div style="font-size: 0.85em; color: var(--text-muted);">${c.email}</div>
            </td>
            <td>${c.subject || 'General Inquiry'}</td>
            <td>
                ${isRead ? '<span class="badge" style="background:#e2e8f0;color:#475569;">Read</span>' : '<span class="badge badge-pending">Unread</span>'}
            </td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewContact(${c.id})">👁 View</button>
            </td>
        </tr>
    `}).join('');
}

function viewContact(id) {
    const contact = allContacts.find(c => c.id === id);
    if (!contact) return;

    currentContactId = id;
    const details = document.getElementById('contactDetails');
    const isRead = contact.is_read || contact.isRead;

    details.innerHTML = `
        <strong>Name:</strong> ${contact.name}<br>
        <strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a><br>
        <strong>Phone:</strong> ${contact.phone || 'N/A'}<br>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
        <strong>Subject:</strong> ${contact.subject || 'General Inquiry'}<br>
        <strong>Message:</strong><br>
        <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0; margin-top: 5px; white-space: pre-wrap;">${contact.message || ''}</div>
    `;

    const markReadBtn = document.getElementById('markReadBtn');
    if (isRead) {
        markReadBtn.style.display = 'none';
    } else {
        markReadBtn.style.display = 'inline-block';
    }

    document.getElementById('viewModal').classList.add('show');
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('show');
    currentContactId = null;
}

async function markAsRead() {
    if (!currentContactId) return;

    try {
        await apiRequest(`/contacts/${currentContactId}/read`, {
            method: 'PUT'
        });
        showToast('Message marked as read', 'success');
        closeViewModal();
        loadContacts();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
