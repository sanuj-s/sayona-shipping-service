// Client Shipments — paginated, XSS-safe, secure invoice download

document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    await loadClientSidebar();
    initShipmentsPage();
});

let clientCurrentPage = 1;
const CLIENT_PAGE_SIZE = 20;

function initShipmentsPage() {
    // Modal logic
    const modal = document.getElementById('createModal');
    const openBtn = document.getElementById('openCreateModalBtn');
    const closeBtn = document.getElementById('closeCreateModalBtn');
    const form = document.getElementById('createShipmentForm');

    if (openBtn) {
        openBtn.addEventListener('click', async () => {
            modal.style.display = 'flex';
            document.getElementById('cTracking').value = `SAY-${Date.now().toString().slice(-6)}`;
            try {
                const user = await PortalAPI.getProfile();
                document.getElementById('cSender').value = user.company || user.name || '';
                document.getElementById('cOrigin').value = user.address || '';
            } catch (e) { }
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitCreateBtn');
            btn.textContent = 'Creating...';
            btn.disabled = true;

            const payload = {
                trackingNumber: document.getElementById('cTracking').value,
                senderName: document.getElementById('cSender').value,
                origin: document.getElementById('cOrigin').value,
                receiverName: document.getElementById('cReceiver').value,
                destination: document.getElementById('cDestination').value,
                industryType: document.getElementById('cIndustry').value,
                currentLocation: document.getElementById('cLocation').value
            };

            try {
                await PortalAPI.createShipment(payload);
                showToast('Shipment created successfully!', 'success');
                modal.style.display = 'none';
                loadShipments();
            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                btn.textContent = 'Create Shipment';
                btn.disabled = false;
            }
        });
    }

    // Event delegation for invoice download buttons
    const tbody = document.getElementById('shipmentsBody');
    if (tbody) {
        tbody.addEventListener('click', async (e) => {
            const invoiceBtn = e.target.closest('[data-invoice-tracking]');
            if (invoiceBtn) {
                e.preventDefault();
                const tracking = invoiceBtn.dataset.invoiceTracking;
                invoiceBtn.textContent = '⏳';
                try {
                    await PortalAPI.downloadInvoice(tracking);
                } catch (err) {
                    showToast('Invoice download failed: ' + err.message, 'error');
                }
                invoiceBtn.innerHTML = '<i class="fas fa-file-invoice"></i> Invoice';
            }
        });
    }

    loadShipments();
}

async function loadShipments() {
    const tbody = document.getElementById('shipmentsBody');

    try {
        const result = await PortalAPI.getShipments({
            page: clientCurrentPage,
            limit: CLIENT_PAGE_SIZE,
        });

        const shipments = result.data || result;
        const shipmentsArr = Array.isArray(shipments) ? shipments : [];
        const pagination = result.pagination || {};

        if (shipmentsArr.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-box-open"></i><p>No shipments found</p></div></td></tr>`;
            const pagEl = document.getElementById('clientPaginationContainer');
            if (pagEl) pagEl.innerHTML = '';
            return;
        }

        tbody.innerHTML = shipmentsArr.map(s => {
            let invoiceBtn = '';
            if (s.status === 'DELIVERED') {
                invoiceBtn = `<button class="btn-portal" data-invoice-tracking="${escapeHtml(s.trackingNumber)}" style="padding:4px 8px; font-size:0.8rem; background:transparent; border:1px solid var(--cp-primary); color:var(--cp-primary); cursor:pointer;"><i class="fas fa-file-invoice"></i> Invoice</button>`;
            }
            return `
            <tr>
                <td><a href="track.html?id=${encodeURIComponent(s.trackingNumber)}" class="tracking-link">${escapeHtml(s.trackingNumber)}</a></td>
                <td>${escapeHtml(s.senderName || '—')}</td>
                <td>${escapeHtml(s.receiverName || '—')}</td>
                <td>${escapeHtml(s.origin || '—')}</td>
                <td>${escapeHtml(s.destination || '—')}</td>
                <td>${statusBadge(s.status)}</td>
                <td style="color:var(--cp-text-muted)">
                    ${formatDate(s.createdAt)}
                    <div style="margin-top:5px;">${invoiceBtn}</div>
                </td>
            </tr>
            `;
        }).join('');

        // Pagination
        const totalPages = pagination.totalPages || Math.ceil((pagination.total || shipmentsArr.length) / CLIENT_PAGE_SIZE);
        renderClientPagination('clientPaginationContainer', clientCurrentPage, totalPages, (page) => {
            clientCurrentPage = page;
            loadShipments();
        });

    } catch (err) {
        tbody.innerHTML = '';
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 7;
        td.style.cssText = 'text-align:center; color:#fca5a5;';
        td.textContent = err.message;
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}
