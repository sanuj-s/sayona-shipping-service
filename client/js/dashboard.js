// Client Dashboard — XSS-safe, shared sidebar

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadClientSidebar();

    const user = PortalAPI.getUser();
    const welcomeEl = document.getElementById('welcomeName');
    if (welcomeEl) welcomeEl.textContent = user?.name?.split(' ')[0] || 'User';

    loadDashboard();
    initQuickTrack();
});

async function loadDashboard() {
    try {
        const result = await PortalAPI.getShipments({ limit: 100 });
        const shipments = Array.isArray(result) ? result : (result.data || result);
        const shipmentsArr = Array.isArray(shipments) ? shipments : [];

        const total = shipmentsArr.length;
        const transit = shipmentsArr.filter(s => s.status === 'IN_TRANSIT' || s.status === 'OUT_FOR_DELIVERY').length;
        const delivered = shipmentsArr.filter(s => s.status === 'DELIVERED').length;
        const pending = shipmentsArr.filter(s => s.status === 'CREATED').length;

        document.getElementById('totalShipments').textContent = total;
        document.getElementById('inTransit').textContent = transit;
        document.getElementById('delivered').textContent = delivered;
        document.getElementById('pending').textContent = pending;

        const tbody = document.getElementById('shipmentsBody');
        if (shipmentsArr.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-box-open"></i><p>No shipments yet</p></div></td></tr>`;
            return;
        }

        tbody.innerHTML = shipmentsArr.slice(0, 5).map(s => `
            <tr>
                <td><a href="track.html?id=${encodeURIComponent(s.trackingNumber)}" class="tracking-link">${escapeHtml(s.trackingNumber)}</a></td>
                <td>${escapeHtml(s.origin || '—')}</td>
                <td>${escapeHtml(s.destination || '—')}</td>
                <td>${statusBadge(s.status)}</td>
                <td style="color:var(--cp-text-muted)">${formatDate(s.createdAt)}</td>
            </tr>
        `).join('');
    } catch (err) {
        const tbody = document.getElementById('shipmentsBody');
        tbody.innerHTML = '';
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 5;
        td.style.cssText = 'text-align:center; color:#fca5a5;';
        td.textContent = err.message;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}

function initQuickTrack() {
    const btn = document.getElementById('quickTrackBtn');
    const input = document.getElementById('quickTrackInput');

    if (btn) {
        btn.addEventListener('click', () => {
            const id = input.value.trim();
            if (id) window.location.href = `track.html?id=${encodeURIComponent(id)}`;
        });
    }
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') btn.click();
        });
    }
}
