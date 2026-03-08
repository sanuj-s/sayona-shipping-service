// Create shipment form handler — adapted for v1 API

document.addEventListener('DOMContentLoaded', () => {
    if (!requireAuth()) return;
    initAdminUI();

    const form = document.getElementById('createShipmentForm');
    if (!form) return;

    // Live Price Calculation
    const weightInput = document.getElementById('weight');
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const serviceInput = document.getElementById('shippingType');
    const pricePreview = document.getElementById('pricePreview');

    const updatePrice = () => {
        const w = parseFloat(weightInput.value) || 0;
        const l = parseFloat(lengthInput.value) || 0;
        const wd = parseFloat(widthInput.value) || 0;
        const h = parseFloat(heightInput.value) || 0;
        const service = serviceInput.value;

        // Base Rates matching PricingService.js
        const rates = {
            standard: { base: 50, w: 5, d: 0.5, m: 1.0 },
            express: { base: 100, w: 8, d: 0.8, m: 1.5 },
            'same-day': { base: 200, w: 15, d: 1.2, m: 2.0 },
            international: { base: 500, w: 25, d: 2.5, m: 3.0 }
        };

        const config = rates[service] || rates.standard;
        const distMock = 500; // Mock 500km distance for preview

        const total = (config.base + (w * config.w) + (distMock * config.d)) * config.m;
        pricePreview.textContent = `$${total.toFixed(2)}`;
    };

    [weightInput, lengthInput, widthInput, heightInput, serviceInput].forEach(el => {
        el?.addEventListener('input', updatePrice);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const clientEmail = document.getElementById('clientEmail')?.value || null;

        const data = {
            trackingNumber: document.getElementById('trackingNumber').value.trim(),
            senderName: document.getElementById('senderName').value.trim(),
            origin: document.getElementById('senderAddress').value.trim(),
            receiverName: document.getElementById('receiverName').value.trim(),
            destination: document.getElementById('receiverAddress').value.trim(),
            industryType: document.getElementById('industryType').value,
            shippingType: serviceInput.value,
            weight: parseFloat(weightInput.value),
            dimensions: `${lengthInput.value}x${widthInput.value}x${heightInput.value}`,
            userEmail: clientEmail,
            packages: [
                {
                    weight: parseFloat(weightInput.value),
                    length: parseFloat(lengthInput.value),
                    width: parseFloat(widthInput.value),
                    height: parseFloat(heightInput.value),
                    fragile: false
                }
            ]
        };

        if (!data.trackingNumber || !data.senderName || !data.origin || !data.receiverName || !data.destination) {
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
                window.location.href = 'shipments.html';
            }, 1000);
        } catch (error) {
            showToast('Failed: ' + error.message, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Shipment';
        }
    });

});
