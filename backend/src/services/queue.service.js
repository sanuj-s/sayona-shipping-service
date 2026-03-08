const { Queue, Worker } = require('bullmq');
const logger = require('../utils/logger');

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

        worker.on('failed', (job, err) => {
            logger.error(`Job ${job?.id} failed in ${queueName}:`, err);
        });

        return worker;
    }
}

module.exports = new QueueService();
