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
                            <div class="tracking-timeline">
                                <h3>📍 Tracking Timeline</h3>
                                ${data.history.map((ev, i) => {
                        const d = new Date(ev.timestamp || ev.createdAt);
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
                                                <div class="timeline-status">${ev.status}</div>
                                                <div class="timeline-location">
                                                    <i class="fas fa-map-marker-alt" style="color:var(--primary); font-size: 0.8rem;"></i> 
                                                    ${ev.location || 'Location Pending'}
                                                </div>
                                                ${ev.description ? `<div class="timeline-desc">${ev.description}</div>` : ''}
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
                            <div class="tracking-badge" style="background: var(--status-${statusLower.replace(/\s+/g, '-')})">${s.status}</div>
                            <div class="tracking-id-display">
                                <span style="color: var(--text-light); font-size: 0.8rem; text-transform: uppercase; font-weight: 600;">Tracking ID:</span>
                                <span style="color: var(--secondary); font-weight: 700; margin-left: 8px;">${s.trackingNumber}</span>
                            </div>
                        </div>

                        ${progressHtml}

                        <div class="tracking-details-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin-top: 30px;">
                            <div class="card" style="padding: 15px; text-align: center;">
                                <div style="font-size: 1.5rem; margin-bottom: 5px;">📤</div>
                                <div style="font-size: 0.7rem; color: var(--text-light); text-transform: uppercase;">From</div>
                                <div style="font-weight: 600;">${s.origin || '—'}</div>
                            </div>
                            <div class="card" style="padding: 15px; text-align: center;">
                                <div style="font-size: 1.5rem; margin-bottom: 5px;">📥</div>
                                <div style="font-size: 0.7rem; color: var(--text-light); text-transform: uppercase;">To</div>
                                <div style="font-weight: 600;">${s.destination || '—'}</div>
                            </div>
                            <div class="card" style="padding: 15px; text-align: center;">
                                <div style="font-size: 1.5rem; margin-bottom: 5px;">⚖️</div>
                                <div style="font-size: 0.7rem; color: var(--text-light); text-transform: uppercase;">Weight</div>
                                <div style="font-weight: 600;">${s.weight ? s.weight + ' kg' : '—'}</div>
                            </div>
                            <div class="card" style="padding: 15px; text-align: center;">
                                <div style="font-size: 1.5rem; margin-bottom: 5px;">📦</div>
                                <div style="font-size: 0.7rem; color: var(--text-light); text-transform: uppercase;">Type</div>
                                <div style="font-weight: 600; text-transform: capitalize;">${s.shippingType || 'Standard'}</div>
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
