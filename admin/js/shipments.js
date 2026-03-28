// Shipments management — server-side pagination, XSS-safe, event delegation

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadSidebar();
    initAdminUI();
    initShipmentsPage();
});

let currentPage = 1;
let currentLimit = 20;
let currentSort = 'created_at';
let currentOrder = 'desc';
let currentShipments = []; // current page data for CSV export

function initShipmentsPage() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const industryFilter = document.getElementById('industryFilter');
    const sortSelect = document.getElementById('sortSelect');
    const perPageSelect = document.getElementById('perPageSelect');
    const csvExportBtn = document.getElementById('csvExportBtn');

    if (searchInput) searchInput.addEventListener('input', debounce(() => { currentPage = 1; loadShipments(); }, 400));
    if (statusFilter) statusFilter.addEventListener('change', () => { currentPage = 1; loadShipments(); });
    if (industryFilter) industryFilter.addEventListener('change', () => { currentPage = 1; loadShipments(); });
    if (sortSelect) sortSelect.addEventListener('change', () => {
        const [sort, order] = sortSelect.value.split(':');
        currentSort = sort;
        currentOrder = order;
        currentPage = 1;
        loadShipments();
    });
    if (perPageSelect) perPageSelect.addEventListener('change', () => {
        currentLimit = parseInt(perPageSelect.value);
        currentPage = 1;
        loadShipments();
    });
    if (csvExportBtn) csvExportBtn.addEventListener('click', exportCSV);

    // Event delegation for delete buttons
    const tbody = document.getElementById('shipmentsBody');
    if (tbody) {
        tbody.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('[data-delete-tracking]');
            if (deleteBtn) {
                confirmDelete(deleteBtn.dataset.deleteTracking);
            }
        });
    }

    // Modal buttons
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteModal);
    if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', executeDelete);

    loadShipments();
}

async function loadShipments() {
    const tbody = document.getElementById('shipmentsBody');
    tbody.innerHTML = renderSkeletonRows(8, 5);

    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const industryFilter = document.getElementById('industryFilter');

    const params = {
        page: currentPage,
        limit: currentLimit,
        sort: currentSort,
        order: currentOrder,
    };

    const search = searchInput?.value.trim();
    if (search) params.search = search;

    const status = statusFilter?.value;
    if (status) params.status = status;

    const industry = industryFilter?.value;
    if (industry) params.industryType = industry;

    try {
        const result = await getShipments(params);
        const shipments = result.data || result;
        const pagination = result.pagination || {};

        currentShipments = Array.isArray(shipments) ? shipments : [];

        const countEl = document.getElementById('shipmentCount');
        if (countEl) {
            const total = pagination.total || currentShipments.length;
            countEl.textContent = `${total} shipment${total !== 1 ? 's' : ''}`;
        }

        renderShipments(currentShipments);

        // Render pagination
        const totalPages = pagination.totalPages || Math.ceil((pagination.total || currentShipments.length) / currentLimit);
        renderPaginationUI('paginationContainer', currentPage, totalPages, (page) => {
            currentPage = page;
            loadShipments();
        });

    } catch (error) {
        showToast('Failed to load shipments: ' + error.message, 'error');
        tbody.innerHTML = renderEmptyState(8, '⚠️', 'Failed to load', 'Please try again later.');
    }
}

function renderShipments(shipments) {
    const tbody = document.getElementById('shipmentsBody');

    if (shipments.length === 0) {
        tbody.innerHTML = renderEmptyState(8, '📦', 'No shipments found', 'Try adjusting your filters or create a new shipment.', '+ Create Shipment', 'create-shipment.html');
        return;
    }

    tbody.innerHTML = shipments.map(s => `
        <tr>
            <td class="tracking-id">${escapeHtml(s.trackingNumber)}</td>
            <td>${escapeHtml(s.senderName)}</td>
            <td>${escapeHtml(s.receiverName)}</td>
            <td><span class="badge" style="background:#e0e7ff; color:#3730a3;">${escapeHtml(s.industryType || 'Unspecified')}</span></td>
            <td>${escapeHtml(s.origin || '—')} → ${escapeHtml(s.destination || '—')}</td>
            <td><span class="badge badge-${getStatusClass(s.status)}">${escapeHtml(s.status)}</span></td>
            <td>${formatDate(s.createdAt)}</td>
            <td>
                <div class="action-btns">
                    <a href="update-status.html?tracking=${encodeURIComponent(s.trackingNumber)}" class="btn btn-outline btn-sm">✏️ Edit</a>
                    <button class="btn btn-danger btn-sm" data-delete-tracking="${escapeHtml(s.trackingNumber)}">🗑</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ─────────── Delete Modal ───────────
let deleteTarget = null;

function confirmDelete(trackingNumber) {
    deleteTarget = trackingNumber;
    const trackingDisplay = document.getElementById('deleteTrackingId');
    if (trackingDisplay) trackingDisplay.textContent = trackingNumber;
    document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('show');
    deleteTarget = null;
}

async function executeDelete() {
    if (!deleteTarget) return;

    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Deleting...';
    }

    try {
        await deleteShipmentAPI(deleteTarget);
        showToast('Shipment deleted successfully', 'success');
        closeDeleteModal();
        loadShipments();
    } catch (error) {
        showToast('Delete failed: ' + error.message, 'error');
    } finally {
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Delete Shipment';
        }
    }
}

// ─────────── CSV Export ───────────
function exportCSV() {
    if (!currentShipments.length) {
        showToast('No shipments to export', 'info');
        return;
    }

    const headers = ['Tracking Number', 'Sender Name', 'Receiver Name', 'Origin', 'Destination', 'Industry Type', 'Status', 'Created Date'];
    const rows = currentShipments.map(s => [
        s.trackingNumber || '',
        s.senderName || '',
        s.receiverName || '',
        s.origin || '',
        s.destination || '',
        s.industryType || '',
        s.status || '',
        s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : '',
    ]);

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `shipments-${today}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('CSV exported successfully', 'success');
}
