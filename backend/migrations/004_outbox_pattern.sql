-- ═══════════════════════════════════════════════════════════════
-- Outbox Pattern Support
-- Version: 004
-- Ensures event emission consistency via database transactions.
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS outbox_events (
    id SERIAL PRIMARY KEY,
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast scanning of unprocessed messages
CREATE INDEX IF NOT EXISTS idx_outbox_unprocessed ON outbox_events(created_at) WHERE processed_at IS NULL;
