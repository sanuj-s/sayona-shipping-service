const { pool } = require('../config/database');
const logger = require('../utils/logger');

class ArchiveService {
    /**
     * Archive/Delete tracking events older than 2 years and audit logs older than 3 years.
     * Called automatically by the cron worker job.
     */
    async enforceDataRetention() {
        logger.info('[ArchiveService] Starting nightly data retention enforcement cycle...');
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Delete tracking events older than 2 years
            // In a real enterprise system, we might insert them into a cold-storage S3 bucket or 'tracking_archives' table first.
            const trackingArchiveThreshold = new Date();
            trackingArchiveThreshold.setFullYear(trackingArchiveThreshold.getFullYear() - 2);

            const trackingResult = await client.query(
                `DELETE FROM tracking_events WHERE created_at < $1`,
                [trackingArchiveThreshold]
            );
            logger.info(`[ArchiveService] Retained tracking events. Removed ${trackingResult.rowCount} old rows.`);

            // 2. Delete audit logs older than 3 years
            const auditArchiveThreshold = new Date();
            auditArchiveThreshold.setFullYear(auditArchiveThreshold.getFullYear() - 3);

            const auditResult = await client.query(
                `DELETE FROM audit_logs WHERE created_at < $1`,
                [auditArchiveThreshold]
            );
            logger.info(`[ArchiveService] Retained audit logs. Removed ${auditResult.rowCount} old rows.`);

            await client.query('COMMIT');
            logger.info('[ArchiveService] Data retention cycle completed successfully.');
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('[ArchiveService] Failed data retention cycle:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = new ArchiveService();
