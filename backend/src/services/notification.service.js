const queueService = require('./queue.service');
const logger = require('../utils/logger');

class NotificationService {
    /**
     * Trigger an asynchronous notification for a shipment status shift.
     */
    async sendStatusUpdate(shipment, trackingEvent) {
        try {
            await queueService.addJob('notifications', 'status_update', {
                shipmentId: shipment.id,
                trackingNumber: shipment.tracking_number,
                customerEmail: shipment.customer_email || 'test@example.com',
                status: trackingEvent.status,
                location: trackingEvent.location,
                timestamp: trackingEvent.created_at
            });
            logger.info(`Notification queued for ${shipment.tracking_number}`);
        } catch (err) {
            logger.error('Failed to queue notification:', err);
        }
    }

    /**
     * Trigger tracking notifications for inbound quote statuses
     */
    async sendQuoteAlert(quote) {
        try {
            await queueService.addJob('notifications', 'quote_alert', { quote });
        } catch (err) {
            logger.error('Failed to queue quote alert:', err);
        }
    }
}

module.exports = new NotificationService();
