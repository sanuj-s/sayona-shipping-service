const AppError = require('../utils/AppError');

class PricingService {
    constructor() {
        this.BASE_RATES = {
            standard: { basePrice: 50, weightRate: 5, distanceRate: 0.5, multiplier: 1.0 },
            express: { basePrice: 100, weightRate: 8, distanceRate: 0.8, multiplier: 1.5 },
            'same-day': { basePrice: 200, weightRate: 15, distanceRate: 1.2, multiplier: 2.0 },
            international: { basePrice: 500, weightRate: 25, distanceRate: 2.5, multiplier: 3.0 }
        };
    }

    /**
     * Calculate price of a shipment
     * @param {Object} details - { weight, distance, serviceType }
     * @returns {number} final cost
     */
    calculatePrice({ weight, distance, serviceType = 'standard' }) {
        const rateProfile = this.BASE_RATES[serviceType.toLowerCase()];

        if (!rateProfile) {
            throw new AppError(`Invalid service type: ${serviceType}`, 400);
        }

        const w = parseFloat(weight) || 0;
        const d = parseFloat(distance) || 0;

        const base = rateProfile.basePrice;
        const weightCost = w * rateProfile.weightRate;
        const distanceCost = d * rateProfile.distanceRate;

        const total = (base + weightCost + distanceCost) * rateProfile.multiplier;

        // Round to 2 decimal places
        return Math.round(total * 100) / 100;
    }
}

module.exports = new PricingService();
