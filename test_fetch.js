const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXVpZCI6IjYwMTliMmJjLTAxNTEtNDBmOC05NGNiLTdlZWY5Y2IzZDQ4NyIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3NzE3ODcwOTAsImV4cCI6MTc3MTc4Nzk5MH0.fob87DcVZCQMQJOR_WTZSPLyBtE2Qxz9pQ2ZBD1T-8Q";

async function run() {
    try {
        const res = await fetch('https://sayona-shipping-service.onrender.com/api/v1/shipments?limit=100', {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        const json = await res.json();
        console.log("Status:", res.status);
        console.log("JSON response:", json);
        const data = json.data !== undefined ? json.data : json;
        console.log("Unwrapped data:", data);
        console.log("Data length:", data.length);
    } catch (err) {
        console.error("Error:", err);
    }
}
run();
