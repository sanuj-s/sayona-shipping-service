const { Queue, Worker } = require('bullmq');
const logger = require('../config/logger');

// Centralize connection options
const connection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: null,
};

class QueueService {
    constructor() {
        this.queues = {};
    }

    getQueue(queueName) {
        if (!this.queues[queueName]) {
            this.queues[queueName] = new Queue(queueName, { connection });
        }
        return this.queues[queueName];
    }

    async addJob(queueName, jobName, data, opts = {}) {
        try {
            const queue = this.getQueue(queueName);
            const job = await queue.add(jobName, data, {
                attempts: 3,
                backoff: { type: 'exponential', delay: 1000 },
                removeOnComplete: true,
                removeOnFail: false,
                ...opts
            });
            logger.info(`Enqueued job ${job.id} in ${queueName}`);
            return job;
        } catch (error) {
            logger.error(`Failed to enqueue job to ${queueName}:`, error);
            throw error;
        }
    }

    createWorker(queueName, processorFn) {
        const worker = new Worker(queueName, processorFn, { connection });

        worker.on('completed', job => {
            logger.info(`Job ${job.id} completed successfully in ${queueName}`);
        });

        worker.on('failed', async (job, err) => {
            logger.error(`Job ${job?.id} failed in ${queueName}:`, err);
            if (job && job.attemptsMade >= job.opts.attempts) {
                // Route to explicit dead-letter queue natively
                const dlq = this.getQueue('dead_letter_queue');
                await dlq.add(`dlq:${queueName}`, {
                    originalJob: job.name,
                    data: job.data,
                    error: err.message,
                    failedAt: new Date().toISOString()
                });
                logger.warn(`[DLQ] Job ${job.id} routed to dead-letter queue.`);
            }
        });

        return worker;
    }
}

module.exports = new QueueService();
