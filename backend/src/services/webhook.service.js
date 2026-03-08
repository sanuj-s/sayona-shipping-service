const queueService = require('./queue.service');
const logger = require('../utils/logger');

class WebhookService {
    /**
     * Dispatch a webhook to external client systems
     */
    async dispatchShipmentWebhook(shipment, eventType = 'shipment.updated') {
        try {
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
                    // Webhooks require robust retrying
                    attempts: 5,
                    backoff: { type: 'exponential', delay: 2000 }
                });
            }
        } catch (err) {
            logger.error('Failed to queue webhook dispatch:', err);
        }
    }
}

module.exports = new WebhookService();
