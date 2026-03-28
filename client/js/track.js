// Client Track Cargo — XSS-safe

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadClientSidebar();

    const trackBtn = document.getElementById('trackBtn');
    const trackInput = document.getElementById('trackInput');

    if (trackBtn) {
        trackBtn.addEventListener('click', () => {
            trackShipment(trackInput.value.trim());
        });
    }
    if (trackInput) {
        trackInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') trackBtn.click();
        });
    }

    // Auto-track from URL param
    const urlId = new URLSearchParams(window.location.search).get('id');
    if (urlId) {
        trackInput.value = urlId;
        trackShipment(urlId);
    }
});

async function trackShipment(id) {
    document.getElementById('trackResult').style.display = 'none';
    document.getElementById('trackError').style.display = 'none';

    if (!id) return;

    try {
        const data = await PortalAPI.getTracking(id);
        const s = data.shipment;

        document.getElementById('shipmentDetails').innerHTML = `
            <div class="detail-item">
                <label>Tracking Number</label>
                <span style="font-family: monospace; color: var(--cp-primary); font-weight:600;">${escapeHtml(s.trackingNumber)}</span>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <span>${statusBadge(s.status)}</span>
            </div>
            <div class="detail-item">
                <label>Sender</label>
                <span>${escapeHtml(s.senderName)}</span>
            </div>
            <div class="detail-item">
                <label>Receiver</label>
                <span>${escapeHtml(s.receiverName)}</span>
            </div>
            <div class="detail-item">
                <label>Current Location</label>
                <span><i class="fas fa-map-pin" style="color:var(--cp-accent)"></i> ${escapeHtml(s.currentLocation)}</span>
            </div>
        `;

        const timeline = document.getElementById('trackingTimeline');
        if (data.history && data.history.length > 0) {
            timeline.innerHTML = data.history.map(ev => `
                <div class="timeline-event">
                    <div class="timeline-dot"></div>
                    <div class="event-status">${escapeHtml(ev.status)}</div>
                    <div class="event-location"><i class="fas fa-map-marker-alt"></i> ${escapeHtml(ev.location)}</div>
                    <div class="event-time">${formatDate(ev.createdAt)}</div>
                </div>
            `).join('');
        } else {
            timeline.innerHTML = '<p style="color:var(--cp-text-muted)">No tracking events yet.</p>';
        }

        document.getElementById('trackResult').style.display = 'block';
    } catch (err) {
        document.getElementById('trackErrorMsg').textContent = err.message;
        document.getElementById('trackError').style.display = 'block';
    }
}
