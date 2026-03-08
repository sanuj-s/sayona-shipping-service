// Shipments management page

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    initAdminUI();
    loadShipments();

    // Search and filter
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const industryFilter = document.getElementById('industryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterShipments, 300));
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filterShipments);
    }
    if (industryFilter) {
        industryFilter.addEventListener('change', filterShipments);
    }
});

let allShipments = [];

async function loadShipments() {
    const tbody = document.getElementById('shipmentsBody');
    tbody.innerHTML = '<tr><td colspan="7"><div class="spinner"></div></td></tr>';

    try {
        allShipments = await getShipments();
        renderShipments(allShipments);
    } catch (error) {
        showToast('Failed to load shipments: ' + error.message, 'error');
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><p>Failed to load</p></td></tr>';
    }
}

function filterShipments() {
    const query = (document.getElementById('searchInput').value || '').toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const industry = document.getElementById('industryFilter') ? document.getElementById('industryFilter').value : '';

    let filtered = allShipments;

    if (query) {
        filtered = filtered.filter(s =>
            (s.trackingNumber || '').toLowerCase().includes(query) ||
            (s.senderName || '').toLowerCase().includes(query) ||
            (s.receiverName || '').toLowerCase().includes(query) ||
            (s.origin || '').toLowerCase().includes(query) ||
            (s.destination || '').toLowerCase().includes(query)
        );
    }

    if (status) {
        filtered = filtered.filter(s => s.status === status);
    }

    if (industry) {
        filtered = filtered.filter(s => s.industryType === industry);
    }

    renderShipments(filtered);
}

function renderShipments(shipments) {
    const tbody = document.getElementById('shipmentsBody');
    const countEl = document.getElementById('shipmentCount');

    if (countEl) countEl.textContent = `${shipments.length} shipment${shipments.length !== 1 ? 's' : ''}`;

    if (shipments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-state"><div class="empty-icon">📦</div><p>No shipments found</p></td></tr>`;
        return;
    }

    tbody.innerHTML = shipments.map(s => `
        <tr>
            <td class="tracking-id">${s.trackingNumber}</td>
            <td>${s.senderName}</td>
            <td>${s.receiverName}</td>
            <td><span class="badge" style="background:#e0e7ff; color:#3730a3;">${s.industryType || 'Unspecified'}</span></td>
            <td>${s.origin || '—'} → ${s.destination || '—'}</td>
            <td><span class="badge badge-${getStatusClass(s.status)}">${s.status}</span></td>
            <td>${formatDate(s.createdAt)}</td>
            <td>
                <div class="action-btns">
                    <a href="update-status.html?tracking=${s.trackingNumber}" class="btn btn-outline btn-sm">✏️ Edit</a>
                    <button class="btn btn-danger btn-sm" onclick="confirmDelete('${s.trackingNumber}')">🗑</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Delete confirmation
let deleteTarget = null;

function confirmDelete(trackingNumber) {
    deleteTarget = trackingNumber;
    const overlay = document.getElementById('deleteModal');
    const trackingDisplay = document.getElementById('deleteTrackingId');
    if (trackingDisplay) trackingDisplay.textContent = trackingNumber;
    overlay.classList.add('show');
}

function closeDeleteModal() {
    const overlay = document.getElementById('deleteModal');
    overlay.classList.remove('show');
    deleteTarget = null;
}

async function executeDelete() {
    if (!deleteTarget) return;

    try {
        await deleteShipmentAPI(deleteTarget);
        showToast('Shipment deleted successfully', 'success');
        closeDeleteModal();
        loadShipments();
    } catch (error) {
        showToast('Delete failed: ' + error.message, 'error');
    }
}

function getStatusClass(status) {
    if (!status) return 'created';
    const s = status.toLowerCase().replace(/\s+/g, '-');
    if (s.includes('pending') || s.includes('created')) return 'created';
    if (s.includes('picked')) return 'picked';
    if (s.includes('warehouse')) return 'warehouse';
    if (s.includes('transit') || s.includes('shipped')) return 'transit';
    if (s.includes('out-for-delivery')) return 'out-delivery';
    if (s.includes('delivered')) return 'delivered';
    if (s.includes('fail')) return 'failed';
    if (s.includes('return')) return 'returned';
    return 'created';
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
