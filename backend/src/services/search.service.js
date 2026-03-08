const { Client } = require('@elastic/elasticsearch');
const logger = require('../utils/logger');
const config = require('../config/environment');

class SearchService {
    constructor() {
        this.client = new Client({
            node: process.env.ELASTICSEARCH_URL || 'http://elasticsearch:9200',
        });
        this.indexName = 'shipments';
    }

    /**
     * Initializes the Elasticsearch indices
     */
    async initIndex() {
        try {
            const exists = await this.client.indices.exists({ index: this.indexName });
            if (!exists) {
                await this.client.indices.create({
                    index: this.indexName,
                    body: {
                        mappings: {
                            properties: {
                                tracking_number: { type: 'keyword' },
                                origin: { type: 'text' },
                                destination: { type: 'text' },
                                status: { type: 'keyword' },
                                sender_name: { type: 'text' },
                                receiver_name: { type: 'text' },
                            }
                        }
                    }
                });
                logger.info(`[Elasticsearch] Initialized index: ${this.indexName}`);
            }
        } catch (err) {
            logger.warn('[Elasticsearch] Failed to initialize index (Is the cluster running?)', err.message);
        }
    }

    /**
     * Index or update a shipment document
     */
    async indexShipment(shipment) {
        if (!shipment) return;
        try {
            await this.client.index({
                index: this.indexName,
                id: shipment.uuid,
                body: {
                    tracking_number: shipment.trackingNumber,
                    origin: shipment.origin,
                    destination: shipment.destination,
                    status: shipment.status,
                    sender_name: shipment.senderName,
                    receiver_name: shipment.receiverName,
                    timestamp: new Date().toISOString()
                }
            });
            logger.info(`[Elasticsearch] Indexed shipment ${shipment.trackingNumber}`);
        } catch (err) {
            logger.error(`[Elasticsearch] Failed to index shipment ${shipment.trackingNumber}`, err.message);
        }
    }
}

module.exports = new SearchService();
