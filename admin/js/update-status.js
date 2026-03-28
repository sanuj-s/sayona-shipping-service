// Update shipment status page — XSS-safe

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadSidebar();
    initAdminUI();

    const params = new URLSearchParams(window.location.search);
    const trackingNumber = params.get('tracking');

    if (!trackingNumber) {
        showToast('No tracking number provided', 'error');
        return;
    }

    document.getElementById('trackingDisplay').textContent = trackingNumber;
    loadShipmentDetail(trackingNumber);
    loadTrackingHistory(trackingNumber);
    initUpdateForm(trackingNumber);
});

async function loadShipmentDetail(trackingNumber) {
    try {
        const data = await getShipment(trackingNumber);
        const shipment = data.shipment || data;
        const grid = document.getElementById('detailGrid');
        grid.innerHTML = `
            <div class="detail-item">
                <label>Tracking Number</label>
                <div class="value tracking-id">${escapeHtml(shipment.trackingNumber)}</div>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <div class="value"><span class="badge badge-${getStatusClass(shipment.status)}">${escapeHtml(shipment.status)}</span></div>
            </div>
            <div class="detail-item">
                <label>Sender</label>
                <div class="value">${escapeHtml(shipment.senderName)}</div>
            </div>
            <div class="detail-item">
                <label>Receiver</label>
                <div class="value">${escapeHtml(shipment.receiverName)}</div>
            </div>
            <div class="detail-item">
                <label>Origin</label>
                <div class="value">${escapeHtml(shipment.origin || '—')}</div>
            </div>
            <div class="detail-item">
                <label>Destination</label>
                <div class="value">${escapeHtml(shipment.destination || '—')}</div>
            </div>
            <div class="detail-item">
                <label>Current Location</label>
                <div class="value">${escapeHtml(shipment.currentLocation || '—')}</div>
            </div>
            <div class="detail-item">
                <label>Created</label>
                <div class="value">${formatDate(shipment.createdAt)}</div>
            </div>
        `;
    } catch (error) {
        showToast('Failed to load shipment: ' + error.message, 'error');
    }
}

async function loadTrackingHistory(trackingNumber) {
    try {
        const data = await getTrackingHistory(trackingNumber);
        const timeline = document.getElementById('trackingTimeline');
        const history = data.history || [];

        if (history.length === 0) {
            timeline.innerHTML = '<div class="empty-state"><div class="empty-icon">📍</div><p class="empty-title">No tracking events yet</p><p class="empty-subtitle">Update the status to add the first event.</p></div>';
            return;
        }

        timeline.innerHTML = history.map(event => `
            <div class="timeline-item">
                <div class="tl-status">${escapeHtml(event.status)}</div>
                <div class="tl-location">📍 ${escapeHtml(event.location)}</div>
                ${event.description ? `<div class="tl-desc" style="font-size:0.85em;color:#64748b;">${escapeHtml(event.description)}</div>` : ''}
                <div class="tl-time">${formatDateTime(event.createdAt)}</div>
            </div>
        `).join('');
    } catch (error) {
        showToast('Failed to load tracking history: ' + error.message, 'error');
    }
}

function initUpdateForm(trackingNumber) {
    const form = document.getElementById('updateForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const status = document.getElementById('newStatus').value;
        const location = document.getElementById('newLocation').value.trim();

        if (!status) {
            showToast('Please select a status', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Updating...';

        try {
            await updateShipmentAPI(trackingNumber, {
                status,
                currentLocation: location || undefined
            });

            showToast('Status updated successfully!', 'success');

            loadShipmentDetail(trackingNumber);
            loadTrackingHistory(trackingNumber);

            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update Status';
        } catch (error) {
            showToast('Update failed: ' + error.message, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update Status';
        }
    });
}
