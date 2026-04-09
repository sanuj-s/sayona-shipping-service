const { pool } = require('../config/database');

class WebhookRepository {
    async findActiveByUser(userId, eventStr) {
        const query = `
            SELECT url, events 
            FROM webhooks 
            WHERE user_id = $1 AND is_active = true
        `;
        const { rows } = await pool.query(query, [userId]);
        
        // Filter those configured for this event if needed
        return rows.filter(r => r.events.includes(eventStr)).map(r => r.url);
    }

    async createWebhook(userId, url, events = ['shipment.updated']) {
        const query = `
            INSERT INTO webhooks (user_id, url, events)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const { rows } = await pool.query(query, [userId, url, JSON.stringify(events)]);
        return rows[0];
    }
}

module.exports = new WebhookRepository();
