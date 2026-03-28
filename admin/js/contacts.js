// Contacts management — XSS-safe, textContent for messages, event delegation

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadSidebar();
    initAdminUI();
    loadContacts();

    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) searchInput.addEventListener('input', debounce(filterContacts, 300));
    if (statusFilter) statusFilter.addEventListener('change', filterContacts);

    // Event delegation for view buttons
    const tbody = document.getElementById('contactsBody');
    if (tbody) {
        tbody.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('[data-view-uuid]');
            if (viewBtn) {
                viewContact(viewBtn.dataset.viewUuid);
            }
        });
    }

    // Modal buttons
    const closeBtn = document.getElementById('closeContactModalBtn');
    const markReadBtn = document.getElementById('markReadBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeViewModal);
    if (markReadBtn) markReadBtn.addEventListener('click', markAsRead);
});

let allContacts = [];
let currentContact = null;

async function loadContacts() {
    const tbody = document.getElementById('contactsBody');
    tbody.innerHTML = renderSkeletonRows(5, 5);

    try {
        const result = await getContactsAPI({ limit: 100 });
        allContacts = result.data || result;
        if (!Array.isArray(allContacts)) allContacts = [];
        renderContacts(allContacts);
    } catch (error) {
        showToast('Failed to load contacts: ' + error.message, 'error');
        tbody.innerHTML = renderEmptyState(5, '⚠️', 'Failed to load', 'Please try again later.');
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
        filtered = filtered.filter(c => c.isRead === isRead);
    }

    renderContacts(filtered);
}

function renderContacts(contacts) {
    const tbody = document.getElementById('contactsBody');
    const countEl = document.getElementById('contactCount');

    if (countEl) countEl.textContent = `${contacts.length} message${contacts.length !== 1 ? 's' : ''}`;

    if (contacts.length === 0) {
        tbody.innerHTML = renderEmptyState(5, '💬', 'No contact messages', 'No messages match your current filters.');
        return;
    }

    tbody.innerHTML = contacts.map(c => {
        const isRead = c.isRead;
        return `
        <tr class="${isRead ? 'row-read' : 'row-unread'}">
            <td>${formatDateTime(c.createdAt)}</td>
            <td>
                <strong>${escapeHtml(c.name)}</strong>
                <div style="font-size: 0.85em; color: var(--text-muted);">${escapeHtml(c.email)}</div>
            </td>
            <td>${escapeHtml(c.subject || 'General Inquiry')}</td>
            <td>
                ${isRead ? '<span class="badge" style="background:rgba(226,232,240,0.15);color:#94a3b8;">Read</span>' : '<span class="badge badge-pending">Unread</span>'}
            </td>
            <td>
                <button class="btn btn-outline btn-sm" data-view-uuid="${escapeHtml(c.uuid)}">👁 View</button>
            </td>
        </tr>
    `}).join('');
}

function viewContact(uuid) {
    const contact = allContacts.find(c => c.uuid === uuid);
    if (!contact) return;

    currentContact = contact;
    const details = document.getElementById('contactDetails');
    const isRead = contact.isRead;

    // Build details safely using DOM manipulation for message
    details.innerHTML = '';

    // Info section
    const infoHtml = document.createElement('div');
    infoHtml.innerHTML = `
        <strong>Name:</strong> ${escapeHtml(contact.name)}<br>
        <strong>Email:</strong> <a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a><br>
        <strong>Phone:</strong> ${escapeHtml(contact.phone || 'N/A')}<br>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid rgba(255,255,255,0.08);">
        <strong>Subject:</strong> ${escapeHtml(contact.subject || 'General Inquiry')}<br>
        <strong>Message:</strong><br>
    `;
    details.appendChild(infoHtml);

    // Message content — use textContent for user-submitted free text
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'background: rgba(255,255,255,0.04); padding: 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08); margin-top: 5px; white-space: pre-wrap; color: var(--text-secondary);';
    messageDiv.textContent = contact.message || '';
    details.appendChild(messageDiv);

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
    currentContact = null;
}

async function markAsRead() {
    if (!currentContact) return;

    try {
        await markContactReadAPI(currentContact.uuid);
        showToast('Message marked as read', 'success');
        closeViewModal();
        loadContacts();
    } catch (err) {
        showToast(err.message, 'error');
    }
}
