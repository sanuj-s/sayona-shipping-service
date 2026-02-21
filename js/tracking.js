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
        trackBtn.addEventListener("click", async function () {

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

            try {
                const data = await window.api.getTracking(trackingId);
                if (loading) loading.style.display = "none";

                const shipment = data.shipment;

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
                        <p><strong>Tracking ID:</strong> ${shipment.trackingNumber}</p>
                        <p><strong>Sender:</strong> ${shipment.senderName || "N/A"}</p>
                        <p><strong>Receiver:</strong> ${shipment.receiverName || "N/A"}</p>
                        <p><strong>Current Location:</strong> ${shipment.currentLocation || "N/A"}</p>
                        ${progressHtml}
                    </div>
                `;

                if (data.history && data.history.length > 0) {
                    let historyHtml = '<div class="tracking-history" style="margin-top:20px; text-align:left;"><h4>History</h4><ul style="list-style:none; padding:0;">';
                    data.history.forEach(record => {
                        const dateStr = new Date(record.timestamp).toLocaleString();
                        historyHtml += `<li style="margin-bottom:10px; padding:10px; background:#f9f9f9; border-radius:5px; font-size: 0.9em;">
                            <strong>${dateStr}</strong><br>
                            Status: ${record.status}<br>
                            Location: ${record.location}
                        </li>`;
                    });
                    historyHtml += '</ul></div>';
                    resultBox.innerHTML += historyHtml;
                }
            } catch (error) {
                if (loading) loading.style.display = "none";
                resultBox.innerHTML = `
                <div style="color:red; margin-top:20px; text-align:center;">
                    ${error.message || "Error connecting to server. Please ensure the backend is running."}
                </div>
                `;
            }

        });
    }

});
