document.addEventListener("DOMContentLoaded", function () {

    const trackBtn = document.getElementById("trackBtn");
    const input = document.getElementById("trackingInput");
    const resultBox = document.getElementById("resultBox");

    if (trackBtn) {
        trackBtn.addEventListener("click", function () {

            const trackingId = input.value.trim().toUpperCase();

            resultBox.innerHTML = "Checking...";

            if (trackingId === "") {
                resultBox.innerHTML = "Enter tracking ID";
                return;
            }

            const shipment = shipments.find(s => s.trackingId === trackingId);

            setTimeout(() => {

                if (shipment) {
                    resultBox.innerHTML = `
                        <div class="tracking-card">
                            <h3>Status: ${shipment.status}</h3>
                            <p><strong>Tracking ID:</strong> ${shipment.trackingId}</p>
                            <p><strong>Origin:</strong> ${shipment.origin}</p>
                            <p><strong>Destination:</strong> ${shipment.destination}</p>
                            <p><strong>Date:</strong> ${shipment.date}</p>
                        </div>
                    `;
                } else {
                    resultBox.innerHTML = "Tracking ID not found";
                }

            }, 800);

        });
    }

});
