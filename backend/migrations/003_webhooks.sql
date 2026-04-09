-- ═══════════════════════════════════════════════════════════════
-- Webhooks Support
-- Version: 003
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS webhooks (
    id          SERIAL PRIMARY KEY,
    uuid        UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    url         VARCHAR(500) NOT NULL,
    events      JSONB DEFAULT '["shipment.updated"]',
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhooks_user ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_active ON webhooks(is_active);

DROP TRIGGER IF EXISTS trg_webhooks_updated_at ON webhooks;
CREATE TRIGGER trg_webhooks_updated_at
    BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
