const logger = require('../utils/logger');

class RouteService {
    /**
     * Mock an external distance matrix API call
     */
    async estimateDistance(origin, destination) {
        // In a real application, connect to OpenRouteService or Google Maps here

        // Simple deterministic mock based on string lengths for demonstration
        const hash = (origin.length * destination.length) % 100;
        const distanceKm = 100 + (hash * 15);

        logger.debug(`Estimated distance from ${origin} to ${destination} is ${distanceKm}km`);
        return distanceKm;
    }

    /**
     * Calculate transit time (ETA) based on distance and service tier
     */
    async calculateETA(distanceKm, serviceType = 'standard') {
        let avgSpeedKpH = 60; // Standard speed

        switch (serviceType.toLowerCase()) {
            case 'express':
                avgSpeedKpH = 90;
                break;
            case 'same-day':
                avgSpeedKpH = 120; // Air freight proxy
                break;
            case 'international':
                avgSpeedKpH = 800; // Plane
                break;
            default:
                avgSpeedKpH = 60;
        }

        const transitHours = distanceKm / avgSpeedKpH;

        // Add typical handling padding (24h for standard, 12h express, etc)
        const padding = serviceType === 'same-day' ? 2 : 24;

        const totalHours = transitHours + padding;

        const now = new Date();
        now.setHours(now.getHours() + totalHours);

        return now;
    }
}

module.exports = new RouteService();
