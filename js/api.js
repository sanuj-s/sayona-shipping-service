// Helper for API interactions
const API_BASE = "http://localhost:5000/api";

/**
 * Fetch tracking details and history from the server
 * @param {string} trackingId 
 * @returns {Promise<Object>} The shipment data and history
 */
async function getTracking(trackingId) {
    try {
        const response = await fetch(`${API_BASE}/tracking/${trackingId}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Tracking ID not found");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Create a new shipment (Requires Auth later ideally, but left open for frontend quoting logic)
 * @param {Object} data - Contains senderName, origin, receiverName, destination, trackingNumber, currentLocation
 * @returns {Promise<Object>} Created shipment
 */
async function createShipment(data) {
    try {
        const response = await fetch(`${API_BASE}/shipments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to create shipment");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

/**
 * Authenticate employee or admin
 * @param {Object} data - Contains email and password
 * @returns {Promise<Object>} User object and JWT token
 */
async function loginUser(data) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Invalid credentials");
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

window.api = {
    getTracking,
    createShipment,
    loginUser
};
