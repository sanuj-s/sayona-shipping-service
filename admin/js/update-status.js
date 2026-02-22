// Update shipment status page — adapted for v1 API

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
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
                <div class="value tracking-id">${shipment.trackingNumber}</div>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <div class="value"><span class="badge badge-${getStatusClass(shipment.status)}">${shipment.status}</span></div>
            </div>
            <div class="detail-item">
                <label>Sender</label>
                <div class="value">${shipment.senderName}</div>
            </div>
            <div class="detail-item">
                <label>Receiver</label>
                <div class="value">${shipment.receiverName}</div>
            </div>
            <div class="detail-item">
                <label>Origin</label>
                <div class="value">${shipment.origin || '—'}</div>
            </div>
            <div class="detail-item">
                <label>Destination</label>
                <div class="value">${shipment.destination || '—'}</div>
            </div>
            <div class="detail-item">
                <label>Current Location</label>
                <div class="value">${shipment.currentLocation || '—'}</div>
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
            timeline.innerHTML = '<div class="empty-state"><p>No tracking events yet</p></div>';
            return;
        }

        timeline.innerHTML = history.map(event => `
            <div class="timeline-item">
                <div class="tl-status">${event.status}</div>
                <div class="tl-location">📍 ${event.location}</div>
                ${event.description ? `<div class="tl-desc" style="font-size:0.85em;color:#64748b;">${event.description}</div>` : ''}
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

            // Reload data
            loadShipmentDetail(trackingNumber);
            loadTrackingHistory(trackingNumber);

            // Reset form
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

function getStatusClass(status) {
    if (!status) return 'created';
    const s = status.toLowerCase().replace(/[_\s]+/g, '-');
    if (s.includes('created')) return 'pending';
    if (s.includes('transit') || s.includes('out-for')) return 'transit';
    if (s.includes('deliver')) return 'delivered';
    if (s.includes('cancel')) return 'cancelled';
    return 'created';
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}
