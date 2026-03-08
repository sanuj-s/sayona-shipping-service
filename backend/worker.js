const queueService = require('./src/services/queue.service');
const logger = require('./src/utils/logger');
const { initRedis } = require('./src/config/redis');
const archiveService = require('./src/services/archive.service');

// Initialize Redis explicitly for the worker
initRedis();

// Run nightly data retention (Archive old logs/tracking)
setInterval(async () => {
    try {
        await archiveService.enforceDataRetention();
    } catch (err) {
        logger.error('Background Archive Service failed out-of-band', err);
    }
}, 24 * 60 * 60 * 1000);

// Kick off an initial cleanup on boot
archiveService.enforceDataRetention().catch(err => logger.warn('Initial boot archive cleanup warning', err));

const notificationWorker = queueService.createWorker('notifications', async (job) => {
    logger.info(`Processing notification job ${job.id} for type: ${job.name}`);

    if (job.name === 'status_update') {
        const { trackingNumber, status, customerEmail } = job.data;
        // Mock sending email
        logger.info(`[WORKER Mock] Sent email to ${customerEmail}: Shipment ${trackingNumber} is now ${status}`);
    } else if (job.name === 'quote_alert') {
        logger.info(`[WORKER Mock] Alerting admins about new quote: ${job.data.quote.id}`);
    }
});

const webhookWorker = queueService.createWorker('webhooks', async (job) => {
    logger.info(`Processing webhook job ${job.id} targeting ${job.data.url}`);

    // Mock HTTP Request
    const { url, payload } = job.data;
    logger.info(`[WORKER Mock] POST ${url} - Payload: ${JSON.stringify(payload).substring(0, 50)}...`);
    // throw new Error('Simulated payload dropping');
});

logger.info('🚀 Sayona Background Worker Process Started Successfully');
