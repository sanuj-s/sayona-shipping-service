const queueService = require('./queue.service');
const logger = require('../utils/logger');
const { createCircuitBreaker } = require('../config/circuitBreaker');

class WebhookService {
    /**
     * Dispatch a webhook to external client systems
     */
    /**
     * Dispatch a webhook to external client systems
     */
    async dispatchShipmentWebhook(shipment, eventType = 'shipment.updated') {
        const action = async () => {
            // In a real system you'd lookup subscribed webhooks for this user_id
            const mockSubscribedEndpoints = [
                // "https://client-corp.com/api/webhooks/logistics"
            ];

            for (const url of mockSubscribedEndpoints) {
                await queueService.addJob('webhooks', eventType, {
                    url,
                    payload: {
                        event: eventType,
                        timestamp: new Date().toISOString(),
                        data: shipment
                    }
                }, {
                    attempts: 5,
                    backoff: { type: 'exponential', delay: 2000 }
                });
            }
        };

        const fallback = () => {
            logger.warn(`[WebhookFallback] Circuit tripped. Webhook ${eventType} for shipment ${shipment.tracking_number} was dropped to save system stability.`);
        };

        const breaker = createCircuitBreaker(action, 'WebhookDispatch', fallback);

        try {
            await breaker.fire();
        } catch (err) {
            logger.error('Failed to execute webhook dispatch through circuit breaker:', err.message);
        }
    }
}

module.exports = new WebhookService();
