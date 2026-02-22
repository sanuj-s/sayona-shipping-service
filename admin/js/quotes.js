// Quotes management page

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    initAdminUI();
    loadQuotes();

    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) searchInput.addEventListener('input', debounce(filterQuotes, 300));
    if (statusFilter) statusFilter.addEventListener('change', filterQuotes);
});

let allQuotes = [];
let currentQuoteId = null;

async function loadQuotes() {
    const tbody = document.getElementById('quotesBody');
    tbody.innerHTML = '<tr><td colspan="7"><div class="spinner"></div></td></tr>';

    try {
        allQuotes = await apiRequest('/quotes');
        renderQuotes(allQuotes);
    } catch (error) {
        showToast('Failed to load quotes: ' + error.message, 'error');
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state"><p>Failed to load</p></td></tr>';
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

function renderQuotes(quotes) {
    const tbody = document.getElementById('quotesBody');
    const countEl = document.getElementById('quoteCount');

    if (countEl) countEl.textContent = `${quotes.length} request${quotes.length !== 1 ? 's' : ''}`;

    if (quotes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state"><div class="empty-icon">📄</div><p>No quote requests found</p></td></tr>`;
        return;
    }

    tbody.innerHTML = quotes.map(q => `
        <tr>
            <td>${formatDate(q.created_at || q.createdAt)}</td>
            <td>
                <strong>${q.name}</strong>
                <div style="font-size: 0.85em; color: var(--text-muted);">${q.company || q.email}</div>
            </td>
            <td>${q.origin || '—'} → ${q.destination || '—'}</td>
            <td>${q.cargo_type || q.cargoType || '—'}</td>
            <td>${q.weight || '—'}</td>
            <td><span class="badge badge-${getStatusClass(q.status)}">${q.status || 'pending'}</span></td>
            <td>
                <button class="btn btn-outline btn-sm" onclick="viewQuote(${q.id})">👁 View</button>
            </td>
        </tr>
    `).join('');
}

function viewQuote(id) {
    const quote = allQuotes.find(q => q.id === id);
    if (!quote) return;

    currentQuoteId = id;
    const details = document.getElementById('quoteDetails');

    details.innerHTML = `
        <strong>Name:</strong> ${quote.name}<br>
        <strong>Email:</strong> <a href="mailto:${quote.email}">${quote.email}</a><br>
        <strong>Phone:</strong> ${quote.phone || 'N/A'}<br>
        <strong>Company:</strong> ${quote.company || 'N/A'}<br>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
        <strong>Route:</strong> ${quote.origin} → ${quote.destination}<br>
        <strong>Cargo:</strong> ${quote.cargo_type || quote.cargoType}<br>
        <strong>Weight:</strong> ${quote.weight}<br>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #eee;">
        <strong>Message:</strong><br>
        <div style="background: #f9f9f9; padding: 10px; border-radius: 4px; border: 1px solid #e2e8f0; margin-top: 5px; white-space: pre-wrap;">${quote.message || 'No message provided.'}</div>
    `;

    document.getElementById('updateStatusSelect').value = quote.status || 'pending';
    document.getElementById('viewModal').classList.add('show');
}

function closeViewModal() {
    document.getElementById('viewModal').classList.remove('show');
    currentQuoteId = null;
}

async function saveStatus() {
    if (!currentQuoteId) return;
    const newStatus = document.getElementById('updateStatusSelect').value;

    try {
        await apiRequest(`/quotes/${currentQuoteId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        showToast('Status updated', 'success');
        closeViewModal();
        loadQuotes();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function getStatusClass(status) {
    if (!status) return 'pending';
    const s = status.toLowerCase();
    if (s === 'accepted') return 'delivered';
    if (s === 'rejected') return 'cancelled';
    if (s === 'quoted' || s === 'reviewed') return 'transit';
    return 'pending';
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
