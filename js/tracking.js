document.addEventListener("DOMContentLoaded", function () {
    const trackBtn = document.getElementById("trackBtn");
    const input = document.getElementById("trackingInput");
    const resultBox = document.getElementById("resultBox");
    const loading = document.getElementById("loading");

    // Restore last search
    if (input) {
        const lastId = localStorage.getItem("lastTrackingId");
        if (lastId) input.value = lastId;
    }

    // Auto-track from URL param
    const urlId = new URLSearchParams(window.location.search).get('id');
    if (urlId && input) {
        input.value = urlId;
        setTimeout(() => trackBtn?.click(), 300);
    }

    if (trackBtn) {
        trackBtn.addEventListener("click", async function () {
            const trackingId = input.value.trim().toUpperCase();

            if (!trackingId) {
                resultBox.innerHTML = `
                    <div class="tracking-error">
                        <div class="tracking-error-icon">⚠️</div>
                        <h3>Enter a tracking number</h3>
                        <p>Please enter your shipment tracking ID to see status updates.</p>
                    </div>`;
                return;
            }

            localStorage.setItem("lastTrackingId", trackingId);
            if (loading) loading.style.display = "block";
            resultBox.innerHTML = "";

            try {
                const data = await window.api.getTracking(trackingId);
                if (loading) loading.style.display = "none";

                const s = data.shipment;

                // Build progress stepper
                const stages = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered"];
                let activeIdx = 0;
                const statusLower = (s.status || '').toLowerCase();
                if (statusLower.includes('picked')) activeIdx = 1;
                if (statusLower.includes('transit') || statusLower.includes('port') || statusLower.includes('arrived')) activeIdx = 2;
                if (statusLower.includes('out for') || statusLower.includes('delivery')) activeIdx = 3;
                if (statusLower.includes('delivered')) activeIdx = 4;

                const progressHtml = `
                    <div class="tracking-stepper">
                        ${stages.map((stage, i) => `
                            <div class="stepper-step ${i <= activeIdx ? 'active' : ''} ${i === activeIdx ? 'current' : ''}">
                                <div class="stepper-dot">${i < activeIdx ? '✓' : (i === activeIdx ? '●' : '')}</div>
                                <span>${stage}</span>
                            </div>
                            ${i < stages.length - 1 ? `<div class="stepper-line ${i < activeIdx ? 'active' : ''}"></div>` : ''}
                        `).join('')}
                    </div>`;

                // Build timeline
                let timelineHtml = '';
                if (data.history && data.history.length > 0) {
                    timelineHtml = `
                        <div class="tracking-timeline-section">
                            <h3>📍 Tracking Timeline</h3>
                            <div class="tracking-timeline">
                                ${data.history.map((ev, i) => {
                        const d = new Date(ev.timestamp);
                        const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                        const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
                        const icon = getStatusIcon(ev.status);
                        return `
                                        <div class="timeline-event ${i === 0 ? 'latest' : ''}">
                                            <div class="timeline-marker">
                                                <div class="timeline-icon">${icon}</div>
                                                ${i < data.history.length - 1 ? '<div class="timeline-connector"></div>' : ''}
                                            </div>
                                            <div class="timeline-content">
                                                <div class="timeline-status">${window.api.escapeHtml(ev.status)}</div>
                                                <div class="timeline-location">📍 ${window.api.escapeHtml(ev.location)}</div>
                                                ${ev.description ? `<div class="timeline-desc">${window.api.escapeHtml(ev.description)}</div>` : ''}
                                                <div class="timeline-time">${dateStr} • ${timeStr}</div>
                                            </div>
                                        </div>`;
                    }).join('')}
                            </div>
                        </div>`;
                }

                resultBox.innerHTML = `
                    <div class="tracking-result">
                        <div class="tracking-result-header">
                            <div class="tracking-badge">${s.status}</div>
                            <div class="tracking-id-display">
                                <span class="label">Tracking ID</span>
                                <span class="value">${s.trackingNumber}</span>
                            </div>
                        </div>

                        ${progressHtml}

                        <div class="tracking-details-grid">
                            <div class="tracking-detail-card">
                                <div class="detail-icon">📤</div>
                                <div class="detail-label">Sender</div>
                                <div class="detail-value">${window.api.escapeHtml(s.senderName) || '—'}</div>
                            </div>
                            <div class="tracking-detail-card">
                                <div class="detail-icon">📥</div>
                                <div class="detail-label">Receiver</div>
                                <div class="detail-value">${window.api.escapeHtml(s.receiverName) || '—'}</div>
                            </div>
                            <div class="tracking-detail-card">
                                <div class="detail-icon">🏁</div>
                                <div class="detail-label">Origin</div>
                                <div class="detail-value">${window.api.escapeHtml(s.origin) || '—'}</div>
                            </div>
                            <div class="tracking-detail-card">
                                <div class="detail-icon">📍</div>
                                <div class="detail-label">Destination</div>
                                <div class="detail-value">${window.api.escapeHtml(s.destination) || '—'}</div>
                            </div>
                            <div class="tracking-detail-card">
                                <div class="detail-icon">🗺️</div>
                                <div class="detail-label">Current Location</div>
                                <div class="detail-value">${window.api.escapeHtml(s.currentLocation) || '—'}</div>
                            </div>
                            <div class="tracking-detail-card">
                                <div class="detail-icon">📅</div>
                                <div class="detail-label">Ship Date</div>
                                <div class="detail-value">${s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</div>
                            </div>
                        </div>

                        ${timelineHtml}
                    </div>`;

            } catch (error) {
                if (loading) loading.style.display = "none";
                resultBox.innerHTML = `
                    <div class="tracking-error">
                        <div class="tracking-error-icon">🔍</div>
                        <h3>Shipment Not Found</h3>
                        <p>${error.message || 'No shipment found with this tracking number. Please check and try again.'}</p>
                    </div>`;
            }
        });

        // Enter key support
        input?.addEventListener("keypress", (e) => {
            if (e.key === "Enter") trackBtn.click();
        });
    }
});

function getStatusIcon(status) {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return '✅';
    if (s.includes('transit') || s.includes('shipped')) return '🚢';
    if (s.includes('arrived') || s.includes('port')) return '⚓';
    if (s.includes('picked')) return '📦';
    if (s.includes('customs') || s.includes('clearance')) return '📋';
    if (s.includes('out for')) return '🚚';
    if (s.includes('pending') || s.includes('booked')) return '📝';
    return '📌';
}
