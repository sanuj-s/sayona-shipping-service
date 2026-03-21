-- ═══════════════════════════════════════════════════════════════
-- Migration 002: Token Security Hardening
-- - Hash verification tokens (aligned with password reset tokens)
-- - Add expiry enforcement for verification tokens
-- - Drop plaintext verification token column
-- ═══════════════════════════════════════════════════════════════

-- Add hashed verification token + expiry columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;

-- Index for token lookup
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token_hash)
    WHERE verification_token_hash IS NOT NULL;

-- Drop legacy plaintext column
ALTER TABLE users DROP COLUMN IF EXISTS email_verification_token;

-- Add state transition history table
CREATE TABLE IF NOT EXISTS state_transitions (
    id              SERIAL PRIMARY KEY,
    shipment_id     INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
    from_status     shipment_status,
    to_status       shipment_status NOT NULL,
    triggered_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transitions_shipment ON state_transitions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_transitions_created ON state_transitions(created_at);
