-- ═══════════════════════════════════════════════════════════════
-- Migration 000: Migration Tracking System
-- Enables the migration runner to skip already-applied migrations
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS schema_migrations (
    version     VARCHAR(255) PRIMARY KEY,
    applied_at  TIMESTAMP DEFAULT NOW()
);
