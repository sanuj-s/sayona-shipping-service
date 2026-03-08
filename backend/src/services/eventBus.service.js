const EventEmitter = require('events');
const logger = require('../utils/logger');

class EventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(20); // Enterprise logistics can have many listeners
    }

    /**
     * Publish an event safely with logging
     */
    publish(eventName, payload) {
        try {
            logger.info(`[EventBus] Emitting: ${eventName}`, { shipmentId: payload?.id || payload?.shipment?.id });
            this.emit(eventName, payload);
        } catch (error) {
            logger.error(`[EventBus] Failed to emit ${eventName}:`, error);
        }
    }

    /**
     * Subscribe to an event
     */
    subscribe(eventName, handler) {
        this.on(eventName, async (payload) => {
            try {
                await handler(payload);
            } catch (error) {
                logger.error(`[EventBus] Error in handler for ${eventName}:`, error);
            }
        });
    }
}

// Singleton instance
const eventBus = new EventBus();

// --- Domain Event Registrations ---
const notificationService = require('./notification.service');
const webhookService = require('./webhook.service');
const searchService = require('./search.service');

// When a shipment changes state, trigger decouple side-effects
eventBus.subscribe('shipment.updated', async (shipment) => {
    // In a full implementation, we'd look up the exact TrackingEvent here
    const mockTrackingEvent = { status: shipment.status, location: shipment.currentLocation || 'Unknown System Hub', created_at: new Date() };

    await notificationService.sendStatusUpdate(shipment, mockTrackingEvent);
    await webhookService.dispatchShipmentWebhook(shipment, 'shipment.updated');
    await searchService.indexShipment(shipment);
});

eventBus.subscribe('shipment.created', async (shipment) => {
    await webhookService.dispatchShipmentWebhook(shipment, 'shipment.created');
    await searchService.indexShipment(shipment);
});

module.exports = eventBus;
