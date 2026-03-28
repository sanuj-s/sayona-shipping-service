// Dashboard — analytics, charts, recent shipments

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadSidebar();
    initAdminUI();
    loadDashboard();
});

async function loadDashboard() {
    // Show skeleton in recent shipments table
    const tbody = document.getElementById('recentShipmentsBody');
    if (tbody) tbody.innerHTML = renderSkeletonRows(7, 5);

    try {
        const data = await getAnalytics();

        // Stat cards
        document.getElementById('totalShipments').textContent = data.totalShipments || 0;
        document.getElementById('pendingCount').textContent = data.statusCounts['CREATED'] || 0;
        document.getElementById('transitCount').textContent =
            (data.statusCounts['IN_TRANSIT'] || 0) + (data.statusCounts['OUT_FOR_DELIVERY'] || 0);
        document.getElementById('deliveredCount').textContent = data.statusCounts['DELIVERED'] || 0;

        // Charts
        renderStatusChart(data.statusCounts || {});
        renderTimelineChart(data.recentShipments || []);
        renderIndustryChart(data.recentShipments || []);

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
        tbody.innerHTML = renderEmptyState(7, '📦', 'No shipments yet', 'Create your first shipment to get started.', '+ Create Shipment', 'create-shipment.html');
        return;
    }

    tbody.innerHTML = shipments.map(s => `
        <tr>
            <td class="tracking-id">${escapeHtml(s.trackingNumber)}</td>
            <td>${escapeHtml(s.senderName)}</td>
            <td>${escapeHtml(s.receiverName)}</td>
            <td><span class="badge" style="background:#e0e7ff; color:#3730a3;">${escapeHtml(s.industryType || 'Unspecified')}</span></td>
            <td>${escapeHtml(s.origin)} → ${escapeHtml(s.destination)}</td>
            <td><span class="badge badge-${getStatusClass(s.status)}">${escapeHtml(s.status)}</span></td>
            <td>${formatDate(s.createdAt)}</td>
        </tr>
    `).join('');
}

// ─────────── Chart Rendering ───────────

function renderStatusChart(statusCounts) {
    const canvas = document.getElementById('statusChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = Object.keys(statusCounts);
    const values = Object.values(statusCounts);

    if (labels.length === 0) {
        canvas.parentElement.innerHTML = '<div class="chart-empty">No status data available</div>';
        return;
    }

    const colorMap = {
        'CREATED': '#94a3b8',
        'PICKED_UP': '#c084fc',
        'IN_TRANSIT': '#3b82f6',
        'ARRIVED_AT_WAREHOUSE': '#8b5cf6',
        'OUT_FOR_DELIVERY': '#f59e0b',
        'DELIVERED': '#10b981',
        'FAILED_DELIVERY': '#ef4444',
        'RETURNED': '#6366f1',
        'CANCELLED': '#ef4444',
    };

    const colors = labels.map(l => colorMap[l] || '#64748b');

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: labels.map(l => l.replace(/_/g, ' ')),
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: 'rgba(10, 14, 23, 0.8)',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 }
                }
            }
        }
    });
}

function renderTimelineChart(shipments) {
    const canvas = document.getElementById('timelineChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (!shipments.length) {
        canvas.parentElement.innerHTML = '<div class="chart-empty">No timeline data available</div>';
        return;
    }

    // Group by date
    const dateCounts = {};
    shipments.forEach(s => {
        const date = new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        dateCounts[date] = (dateCounts[date] || 0) + 1;
    });

    const labels = Object.keys(dateCounts);
    const values = Object.values(dateCounts);

    new Chart(canvas, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Shipments',
                data: values,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
                y: { ticks: { color: '#64748b', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true }
            },
            plugins: {
                legend: { labels: { color: '#94a3b8' } }
            }
        }
    });
}

function renderIndustryChart(shipments) {
    const canvas = document.getElementById('industryChart');
    if (!canvas || typeof Chart === 'undefined') return;

    if (!shipments.length) {
        canvas.parentElement.innerHTML = '<div class="chart-empty">No industry data available</div>';
        return;
    }

    // Group by industry
    const industryCounts = {};
    shipments.forEach(s => {
        const industry = s.industryType || 'Unspecified';
        industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    });

    const labels = Object.keys(industryCounts);
    const values = Object.values(industryCounts);

    const barColors = ['#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Shipments',
                data: values,
                backgroundColor: labels.map((_, i) => barColors[i % barColors.length]),
                borderRadius: 6,
                maxBarThickness: 50,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } },
                y: { ticks: { color: '#64748b', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.04)' }, beginAtZero: true }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}
