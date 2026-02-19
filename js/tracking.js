document.addEventListener("DOMContentLoaded", function () {

    const trackBtn = document.getElementById("trackBtn");
    const input = document.getElementById("trackingInput");
    const resultBox = document.getElementById("resultBox");
    const loading = document.getElementById("loading");

    // 8. Store tracking searches in browser (Load on page open)
    if (input) {
        const lastId = localStorage.getItem("lastTrackingId");
        if (lastId) {
            input.value = lastId;
        }
    }

    if (trackBtn) {
        trackBtn.addEventListener("click", function () {

            const trackingId = input.value.trim().toUpperCase();

            if (trackingId === "") {
                resultBox.innerHTML = `<div style="color:red; margin-top:20px;">Enter tracking ID</div>`;
                return;
            }

            // Store in localStorage
            localStorage.setItem("lastTrackingId", trackingId);

            // 6. Loading spinner system
            if (loading) loading.style.display = "block";
            resultBox.innerHTML = "";

            const shipment = shipments.find(s => s.trackingId === trackingId);

            setTimeout(() => {
                if (loading) loading.style.display = "none";

                if (shipment) {

                    // Generate progress indicator (2. Shipment status progress bar)
                    const steps = ["Booked", "In Transit", "Out for Delivery", "Delivered"];
                    let currentStepIndex = 0;
                    if (shipment.status.includes("Transit")) currentStepIndex = 1;
                    if (shipment.status.includes("Delivery")) currentStepIndex = 2;
                    if (shipment.status.includes("Delivered")) currentStepIndex = 3;

                    let progressHtml = '<div class="progress">';
                    steps.forEach((step, index) => {
                        let completedClass = index <= currentStepIndex ? "completed" : "";
                        progressHtml += `<div class="step ${completedClass}">${step}</div>`;
                    });
                    progressHtml += '</div>';

                    // 1. Tracking UI improvements (Details card)
                    resultBox.innerHTML = `
                        <div class="tracking-card">
                            <h3>Status: ${shipment.status}</h3>
                            <p><strong>Tracking ID:</strong> ${shipment.trackingId}</p>
                            <p><strong>Origin:</strong> ${shipment.origin}</p>
                            <p><strong>Destination:</strong> ${shipment.destination}</p>
                            <p><strong>Date:</strong> ${shipment.date}</p>
                            ${progressHtml}
                        </div>
                    `;
                } else {
                    // 11. Error handling UI
                    resultBox.innerHTML = `
                    <div style="color:red; margin-top:20px; text-align:center;">
                        Tracking ID not found
                    </div>
                    `;
                }

            }, 1000);

        });
    }

});
