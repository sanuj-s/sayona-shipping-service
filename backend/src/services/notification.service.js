const queueService = require('./queue.service');
const UserRepository = require('../repositories/user.repository');
const logger = require('../config/logger');

class NotificationService {
    /**
     * Trigger an asynchronous notification for a shipment status shift.
     */
    async sendStatusUpdate(shipment, trackingEvent) {
        try {
            let customerEmail = shipment.customer_email;
            if (!customerEmail && shipment.user_id) {
                const user = await UserRepository.findById(shipment.user_id);
                if (user) customerEmail = user.email;
            }

            // Fallback for anonymous shipments if any
            customerEmail = customerEmail || 'test@example.com';

            await queueService.addJob('notifications', 'status_update', {
                shipmentId: shipment.id,
                trackingNumber: shipment.tracking_number,
                customerEmail: customerEmail,
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
