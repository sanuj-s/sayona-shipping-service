// Dashboard — analytics and recent shipments

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    initAdminUI();
    loadDashboard();
});

async function loadDashboard() {
    try {
        const data = await getAnalytics();

        // Stat cards
        document.getElementById('totalShipments').textContent = data.totalShipments || 0;
        document.getElementById('pendingCount').textContent = data.statusCounts['Pending'] || 0;
        document.getElementById('transitCount').textContent =
            (data.statusCounts['In Transit'] || 0) + (data.statusCounts['Shipped'] || 0);
        document.getElementById('deliveredCount').textContent = data.statusCounts['Delivered'] || 0;

        // Recent shipments table
        renderRecentShipments(data.recentShipments || []);

    } catch (error) {
        showToast('Failed to load dashboard: ' + error.message, 'error');
    }
}

function renderRecentShipments(shipments) {
    const tbody = document.getElementById('recentShipmentsBody');
    if (!tbody) return;

    if (shipments.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-state"><p>No shipments yet</p></td></tr>`;
        return;
    }

    tbody.innerHTML = shipments.map(s => `
        <tr>
            <td class="tracking-id">${s.trackingNumber}</td>
            <td>${s.senderName}</td>
            <td>${s.receiverName}</td>
            <td>${s.origin} → ${s.destination}</td>
            <td><span class="badge badge-${getStatusClass(s.status)}">${s.status}</span></td>
            <td>${formatDate(s.createdAt)}</td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    if (!status) return 'created';
    const s = status.toLowerCase().replace(/\s+/g, '-');
    if (s.includes('pending')) return 'pending';
    if (s.includes('transit') || s.includes('shipped')) return 'transit';
    if (s.includes('deliver')) return 'delivered';
    if (s.includes('cancel')) return 'cancelled';
    return 'created';
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
