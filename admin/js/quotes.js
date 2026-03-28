// Quotes management — XSS-safe, event delegation

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadSidebar();
    initAdminUI();
    loadQuotes();

    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) searchInput.addEventListener('input', debounce(filterQuotes, 300));
    if (statusFilter) statusFilter.addEventListener('change', filterQuotes);

    // Event delegation for view buttons
    const tbody = document.getElementById('quotesBody');
    if (tbody) {
        tbody.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('[data-view-uuid]');
            if (viewBtn) {
                viewQuote(viewBtn.dataset.viewUuid);
            }
        });
    }

    // Modal buttons
    const closeBtn = document.getElementById('closeQuoteModalBtn');
    const saveBtn = document.getElementById('saveQuoteStatusBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeViewModal);
    if (saveBtn) saveBtn.addEventListener('click', saveStatus);
});

let allQuotes = [];
let currentQuote = null;

async function loadQuotes() {
    const tbody = document.getElementById('quotesBody');
    tbody.innerHTML = renderSkeletonRows(7, 5);

    try {
        const result = await getQuotesAPI({ limit: 100 });
        allQuotes = result.data || result;
        if (!Array.isArray(allQuotes)) allQuotes = [];
        renderQuotes(allQuotes);
    } catch (error) {
        showToast('Failed to load quotes: ' + error.message, 'error');
        tbody.innerHTML = renderEmptyState(7, '⚠️', 'Failed to load', 'Please try again later.');
    }
}

function filterQuotes() {
    const query = (document.getElementById('searchInput').value || '').toLowerCase();
    const status = document.getElementById('statusFilter').value;

    let filtered = allQuotes;

    if (query) {
        filtered = filtered.filter(q =>
            (q.name || '').toLowerCase().includes(query) ||
            (q.email || '').toLowerCase().includes(query) ||
            (q.company || '').toLowerCase().includes(query) ||
            (q.origin || '').toLowerCase().includes(query) ||
            (q.destination || '').toLowerCase().includes(query)
        );
    }

    if (status) {
        filtered = filtered.filter(q => q.status === status);
    }

    renderQuotes(filtered);
}

function getQuoteStatusClass(status) {
    if (!status) return 'pending';
    const s = status.toLowerCase();
    if (s === 'accepted') return 'delivered';
    if (s === 'rejected') return 'cancelled';
    if (s === 'quoted' || s === 'reviewed') return 'transit';
    return 'pending';
}

function renderQuotes(quotes) {
    const tbody = document.getElementById('quotesBody');
    const countEl = document.getElementById('quoteCount');

    if (countEl) countEl.textContent = `${quotes.length} request${quotes.length !== 1 ? 's' : ''}`;

    if (quotes.length === 0) {
        tbody.innerHTML = renderEmptyState(7, '📄', 'No quote requests', 'No quote requests match your current filters.');
        return;
    }

    tbody.innerHTML = quotes.map(q => `
        <tr>
            <td>${formatDate(q.createdAt)}</td>
            <td>
                <strong>${escapeHtml(q.name)}</strong>
                <div style="font-size: 0.85em; color: var(--text-muted);">${escapeHtml(q.company || q.email)}</div>
            </td>
            <td>${escapeHtml(q.origin || '—')} → ${escapeHtml(q.destination || '—')}</td>
            <td>${escapeHtml(q.cargoType || '—')}</td>
            <td>${escapeHtml(q.weight || '—')}</td>
            <td><span class="badge badge-${getQuoteStatusClass(q.status)}">${escapeHtml(q.status || 'pending')}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" data-view-uuid="${escapeHtml(q.uuid)}">👁 View</button>
            </td>
        </tr>
    `).join('');
}

function viewQuote(uuid) {
    const quote = allQuotes.find(q => q.uuid === uuid);
    if (!quote) return;

    currentQuote = quote;
    const details = document.getElementById('quoteDetails');

    // Build details safely
    details.innerHTML = '';
    const infoDiv = document.createElement('div');
    infoDiv.innerHTML = `
        <strong>Name:</strong> ${escapeHtml(quote.name)}<br>
        <strong>Email:</strong> <a href="mailto:${escapeHtml(quote.email)}">${escapeHtml(quote.email)}</a><br>
        <strong>Phone:</strong> ${escapeHtml(quote.phone || 'N/A')}<br>
        <strong>Company:</strong> ${escapeHtml(quote.company || 'N/A')}<br>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid rgba(255,255,255,0.08);">
        <strong>Route:</strong> ${escapeHtml(quote.origin)} → ${escapeHtml(quote.destination)}<br>
        <strong>Cargo:</strong> ${escapeHtml(quote.cargoType || '—')}<br>
        <strong>Weight:</strong> ${escapeHtml(quote.weight || '—')}<br>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid rgba(255,255,255,0.08);">
        <strong>Message:</strong><br>
    `;
    details.appendChild(infoDiv);

    // Message — use textContent for user-submitted content
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = 'background: rgba(255,255,255,0.04); padding: 10px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.08); margin-top: 5px; white-space: pre-wrap; color: var(--text-secondary);';
    messageDiv.textContent = quote.message || 'No message provided.';
    details.appendChild(messageDiv);

    document.getElementById('updateStatusSelect').value = quote.status || 'pending';
    document.getElementById('viewModal').classList.add('show');
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('show');
    currentQuote = null;
}

async function saveStatus() {
    if (!currentQuote) return;
    const newStatus = document.getElementById('updateStatusSelect').value;

    try {
        await updateQuoteStatusAPI(currentQuote.uuid, newStatus);
        showToast('Status updated', 'success');
        closeViewModal();
        loadQuotes();
    } catch (err) {
        showToast(err.message, 'error');
    }
}
