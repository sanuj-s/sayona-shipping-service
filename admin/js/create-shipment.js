// Create shipment form handler

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    initAdminUI();

    const form = document.getElementById('createShipmentForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const trackingNumber = document.getElementById('trackingNumber').value.trim();
        const senderName = document.getElementById('senderName').value.trim();
        const senderAddress = document.getElementById('senderAddress').value.trim();
        const receiverName = document.getElementById('receiverName').value.trim();
        const receiverAddress = document.getElementById('receiverAddress').value.trim();
        const currentLocation = document.getElementById('currentLocation').value.trim();

        if (!trackingNumber || !senderName || !senderAddress || !receiverName || !receiverAddress || !currentLocation) {
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
                currentLocation
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
