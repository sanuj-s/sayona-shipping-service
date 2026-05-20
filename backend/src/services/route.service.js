const logger = require('../config/logger');

// ─────────────────────────────────────────────
// Curated city coordinates for Haversine distance estimation
// Extend this table as new shipping corridors open
// ─────────────────────────────────────────────
const CITY_COORDS = {
    // India — primary market
    'mumbai':       { lat: 19.0760, lng: 72.8777 },
    'delhi':        { lat: 28.7041, lng: 77.1025 },
    'new delhi':    { lat: 28.6139, lng: 77.2090 },
    'bangalore':    { lat: 12.9716, lng: 77.5946 },
    'bengaluru':    { lat: 12.9716, lng: 77.5946 },
    'chennai':      { lat: 13.0827, lng: 80.2707 },
    'kolkata':      { lat: 22.5726, lng: 88.3639 },
    'hyderabad':    { lat: 17.3850, lng: 78.4867 },
    'pune':         { lat: 18.5204, lng: 73.8567 },
    'ahmedabad':    { lat: 23.0225, lng: 72.5714 },
    'jaipur':       { lat: 26.9124, lng: 75.7873 },
    'lucknow':      { lat: 26.8467, lng: 80.9462 },
    'kochi':        { lat: 9.9312,  lng: 76.2673 },
    'goa':          { lat: 15.2993, lng: 74.1240 },
    'surat':        { lat: 21.1702, lng: 72.8311 },
    'indore':       { lat: 22.7196, lng: 75.8577 },
    'visakhapatnam':{ lat: 17.6868, lng: 83.2185 },
    'nagpur':       { lat: 21.1458, lng: 79.0882 },
    'coimbatore':   { lat: 11.0168, lng: 76.9558 },
    'chandigarh':   { lat: 30.7333, lng: 76.7794 },

    // International shipping hubs
    'new york':     { lat: 40.7128, lng: -74.0060 },
    'los angeles':  { lat: 34.0522, lng: -118.2437 },
    'chicago':      { lat: 41.8781, lng: -87.6298 },
    'london':       { lat: 51.5074, lng: -0.1278 },
    'paris':        { lat: 48.8566, lng: 2.3522 },
    'frankfurt':    { lat: 50.1109, lng: 8.6821 },
    'dubai':        { lat: 25.2048, lng: 55.2708 },
    'singapore':    { lat: 1.3521,  lng: 103.8198 },
    'hong kong':    { lat: 22.3193, lng: 114.1694 },
    'tokyo':        { lat: 35.6762, lng: 139.6503 },
    'shanghai':     { lat: 31.2304, lng: 121.4737 },
    'sydney':       { lat: -33.8688, lng: 151.2093 },
    'toronto':      { lat: 43.6532, lng: -79.3832 },
    'sao paulo':    { lat: -23.5505, lng: -46.6333 },
    'johannesburg': { lat: -26.2041, lng: 28.0473 },
    'nairobi':      { lat: -1.2921, lng: 36.8219 },
    'cairo':        { lat: 30.0444, lng: 31.2357 },
    'istanbul':     { lat: 41.0082, lng: 28.9784 },
    'bangkok':      { lat: 13.7563, lng: 100.5018 },
    'kuala lumpur': { lat: 3.1390,  lng: 101.6869 },
    'jakarta':      { lat: -6.2088, lng: 106.8456 },
    'seoul':        { lat: 37.5665, lng: 126.9780 },
    'moscow':       { lat: 55.7558, lng: 37.6173 },
    'amsterdam':    { lat: 52.3676, lng: 4.9041 },
};

/**
 * Default distance (km) when one or both cities are not in the lookup table.
 * Chosen as a reasonable mid-range domestic distance.
 */
const DEFAULT_DISTANCE_KM = 500;

/**
 * Haversine formula — great-circle distance between two lat/lng points
 * @returns {number} Distance in kilometres
 */
function haversineKm(a, b) {
    const R = 6371; // Earth's mean radius in km
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const sinLat = Math.sin(dLat / 2);
    const sinLng = Math.sin(dLng / 2);
    const h = sinLat * sinLat +
        Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sinLng * sinLng;
    return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Normalize a location string to a lookup key.
 * Strips leading/trailing whitespace, lowercases, and removes
 * common suffixes like ", India" or ", USA" for flexible matching.
 */
function normalizeCity(location) {
    return location
        .trim()
        .toLowerCase()
        .replace(/,\s*(india|usa|uk|uae|australia|canada|japan|china|germany|france|brazil|south africa|kenya|egypt|turkey|thailand|malaysia|indonesia|south korea|russia|netherlands|singapore)$/i, '')
        .trim();
}

class RouteService {
    /**
     * Estimate the distance between two locations using a curated coordinate
     * lookup table and the Haversine formula.
     *
     * Falls back to DEFAULT_DISTANCE_KM (500 km) if either location is unknown,
     * logging a warning so unknown cities can be added to the table.
     */
    async estimateDistance(origin, destination) {
        const originKey = normalizeCity(origin);
        const destKey = normalizeCity(destination);

        const originCoords = CITY_COORDS[originKey];
        const destCoords = CITY_COORDS[destKey];

        if (!originCoords || !destCoords) {
            const missing = [];
            if (!originCoords) missing.push(`origin="${origin}" (key="${originKey}")`);
            if (!destCoords) missing.push(`destination="${destination}" (key="${destKey}")`);
            logger.warn(`Unknown city in distance lookup: ${missing.join(', ')}. Using default ${DEFAULT_DISTANCE_KM}km.`);
            return DEFAULT_DISTANCE_KM;
        }

        const distanceKm = Math.round(haversineKm(originCoords, destCoords));

        logger.debug(`Estimated distance from ${origin} to ${destination}: ${distanceKm}km (Haversine)`);
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
