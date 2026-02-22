// Create shipment form handler — adapted for v1 API

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    initAdminUI();

    const form = document.getElementById('createShipmentForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const clientEmail = document.getElementById('clientEmail')?.value || null;

        const data = {
            trackingNumber: document.getElementById('trackingNumber').value.trim(),
            senderName: document.getElementById('senderName').value.trim(),
            origin: document.getElementById('senderAddress').value.trim(),
            receiverName: document.getElementById('receiverName').value.trim(),
            destination: document.getElementById('receiverAddress').value.trim(),
            currentLocation: document.getElementById('currentLocation').value.trim(),
            industryType: document.getElementById('industryType').value,
            userEmail: clientEmail
        };

        if (!data.trackingNumber || !data.senderName || !data.origin || !data.receiverName || !data.destination || !data.currentLocation) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating...';

        try {
            await createShipmentAPI(data);

            showToast('Shipment created successfully!', 'success');

            setTimeout(() => {
                window.location.href = '/admin/shipments.html';
            }, 1000);
        } catch (error) {
            showToast('Failed: ' + error.message, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Shipment';
        }
    });
});
