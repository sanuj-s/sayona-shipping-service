const queueService = require('./queue.service');
const WebhookRepository = require('../repositories/webhook.repository');
const logger = require('../config/logger');
const { createCircuitBreaker } = require('../config/circuitBreaker');

class WebhookService {
    /**
     * Dispatch a webhook to external client systems
     */
    async dispatchShipmentWebhook(shipment, eventType = 'shipment.updated') {
        const action = async () => {
            if (!shipment.user_id) return; // No client attached 
            const endpoints = await WebhookRepository.findActiveByUser(shipment.user_id, eventType);

            for (const url of endpoints) {
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
