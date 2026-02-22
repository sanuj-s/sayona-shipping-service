// Create shipment form handler

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
            senderAddress: document.getElementById('senderAddress').value.trim(),
            receiverName: document.getElementById('receiverName').value.trim(),
            receiverAddress: document.getElementById('receiverAddress').value.trim(),
            currentLocation: document.getElementById('currentLocation').value.trim(),
            industryType: document.getElementById('industryType').value,
            userEmail: clientEmail
        };

        if (!data.trackingNumber || !data.senderName || !data.senderAddress || !data.receiverName || !data.receiverAddress || !data.currentLocation) {
            showToast('Please fill all fields', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating...';

        try {
            await createShipmentAPI({
                trackingNumber,
                senderName,
                senderAddress,
                receiverName,
                receiverAddress,
                currentLocation,
                industryType
            });

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
