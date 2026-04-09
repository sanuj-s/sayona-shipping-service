// ─────────────────────────────────────────────
// Outbox Scanner Worker — Polling Daemon
// Reads `outbox_events` where processed_at is null
// Dispatches to BullMQ logically, then marks read.
// ─────────────────────────────────────────────
const { query } = require('../config/database');
const queueService = require('../services/queue.service');
const logger = require('../config/logger');

const POLLING_INTERVAL = 3000; // Scan every 3 seconds

async function processOutbox() {
    try {
        // Find unprocessed records gracefully
        const { rows } = await query(
            `SELECT * FROM outbox_events 
             WHERE processed_at IS NULL 
             ORDER BY created_at ASC 
             LIMIT 100`
        );

        if (rows.length === 0) return;

        for (const event of rows) {
            // Dispatch standard domain event
            if (event.event_type.startsWith('shipment.')) {
                // To decouple slightly, we can drop this in a general domain_events queue
                // For now, if we match our webhooks or notifications schema mapping:
                
                // Emulate stateMachine dispatch hook asynchronously
                await queueService.addJob('webhooks', event.event_type, {
                    url: null, // Logic must resolve subscribers inside the job or before
                    payload: event.payload
                }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 }});
                
                // Here we safely mark processed *AFTER* placing securely onto Redis Queue
                await query('UPDATE outbox_events SET processed_at = NOW() WHERE id = $1', [event.id]);
            }
        }
    } catch (err) {
        logger.error('[OutboxWorker] Failed to process outbox:', err.message);
    }
}

async function startOutboxWorker() {
    logger.info('[OutboxWorker] Initializing scanner...');
    setInterval(processOutbox, POLLING_INTERVAL);
}

module.exports = { startOutboxWorker };
