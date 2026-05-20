// ─────────────────────────────────────────────
// Worker Entry Point — BullMQ Job Processors
// Runs as a separate process: `npm run worker`
//
// Processors:
//   notifications — sends real emails via EmailService
//   webhooks      — POSTs to client URLs with HMAC-SHA256 signing
//   outbox        — polls outbox_events table and relays to queues
// ─────────────────────────────────────────────
const crypto = require('crypto');
const logger = require('./src/config/logger');
const queueService = require('./src/services/queue.service');
const EmailService = require('./src/services/email.service');
const { startOutboxWorker } = require('./src/workers/outbox.worker');

// ─────────────── Configuration ───────────────
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'whsec_dev_default_change_in_production';
const WEBHOOK_TIMEOUT_MS = 10000;

// ─────────────── Notification Worker ───────────────
// Processes email jobs enqueued by the application.
function startNotificationWorker() {
    const worker = queueService.createWorker('notifications', async (job) => {
        const { type, to, ...data } = job.data;

        logger.info(`[NotificationWorker] Processing ${type} email for ${to || 'N/A'}`, { jobId: job.id });

        switch (type) {
            case 'password_reset':
                await EmailService.sendPasswordResetEmail(to, data.token);
                break;
            case 'verification':
                await EmailService.sendVerificationEmail(to, data.token);
                break;
            case 'quote':
                await EmailService.sendQuoteNotification(data.quote);
                break;
            default:
                logger.warn(`[NotificationWorker] Unknown notification type: ${type}`, { jobId: job.id });
        }

        logger.info(`[NotificationWorker] Completed ${type} email for ${to || 'N/A'}`, { jobId: job.id });
    });

    logger.info('[NotificationWorker] Started — listening on "notifications" queue');
    return worker;
}

// ─────────────── Webhook Worker ───────────────
// POSTs event payloads to client-registered webhook URLs
// with HMAC-SHA256 signature for payload integrity verification.
function startWebhookWorker() {
    const worker = queueService.createWorker('webhooks', async (job) => {
        const { url, payload, secret } = job.data;

        if (!url) {
            logger.warn(`[WebhookWorker] Skipping job ${job.id}: no target URL provided`);
            return;
        }

        const body = JSON.stringify(payload);
        const signingKey = secret || WEBHOOK_SECRET;
        const signature = crypto.createHmac('sha256', signingKey).update(body).digest('hex');
        const timestamp = Math.floor(Date.now() / 1000);

        logger.info(`[WebhookWorker] POSTing ${payload.event || 'unknown'} to ${url}`, { jobId: job.id });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Sayona-Signature': `sha256=${signature}`,
                'X-Sayona-Timestamp': timestamp.toString(),
                'X-Sayona-Event': payload.event || 'shipment.updated',
                'User-Agent': 'SayonaShipping-Webhook/2.0',
            },
            body,
            signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
        });

        if (!response.ok) {
            const errorBody = await response.text().catch(() => '(no body)');
            throw new Error(`Webhook POST to ${url} failed with status ${response.status}: ${errorBody}`);
        }

        logger.info(`[WebhookWorker] Successfully delivered to ${url} (${response.status})`, { jobId: job.id });
    });

    logger.info('[WebhookWorker] Started — listening on "webhooks" queue');
    return worker;
}

// ─────────────── Bootstrap ───────────────
async function main() {
    logger.info('═══════════════════════════════════════');
    logger.info('  Sayona Shipping — Worker Process');
    logger.info('═══════════════════════════════════════');

    try {
        // Start BullMQ job processors
        startNotificationWorker();
        startWebhookWorker();

        // Start the outbox scanner (polls DB for unprocessed domain events)
        await startOutboxWorker();

        logger.info('[Worker] All processors running. Waiting for jobs...');
    } catch (error) {
        logger.error('[Worker] Fatal startup error:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('[Worker] Received SIGINT, shutting down...');
    process.exit(0);
});
process.on('SIGTERM', () => {
    logger.info('[Worker] Received SIGTERM, shutting down...');
    process.exit(0);
});

main();
