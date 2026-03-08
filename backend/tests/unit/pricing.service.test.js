const pricingService = require('../../src/services/pricing.service');

describe('Pricing Service Domain Logic Integration:', () => {
    it('should calculate standard shipment price correctly without multipliers', () => {
        // Base Price 50 + Weight (10 * 5) + Distance (100 * 0.5) = 150
        const price = pricingService.calculatePrice({
            weight: 10,
            distance: 100,
            serviceType: 'standard'
        });
        expect(price).toBe(150.00);
    });

    it('should calculate international shipment price incorporating major multipliers', () => {
        // International tier setup: Base (500) + Weight (10 * 25) + Distance (2000 * 2.5) = (500 + 250 + 5000) = 5750
        // Total multiplied by Base rate of tier (3.0): 5750 * 3 = 17250
        const price = pricingService.calculatePrice({
            weight: 10,
            distance: 2000,
            serviceType: 'international'
        });
        expect(price).toBe(17250.00);
    });

    it('should throw Error on invalid unsupported configurations', () => {
        expect(() => {
            pricingService.calculatePrice({
                weight: 10,
                distance: 100,
                serviceType: 'alien-ship'
            });
        }).toThrow(/Invalid service type: alien-ship/);
    });
});
