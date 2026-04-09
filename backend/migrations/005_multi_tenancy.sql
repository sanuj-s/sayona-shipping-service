-- ═══════════════════════════════════════════════════════════════
-- Multi-Tenancy Readiness
-- Version: 005
-- Injects tenant boundaries into all core scalable tables.
-- ═══════════════════════════════════════════════════════════════

-- 1. Create native tenants mapping if it doesn't exist
CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Note: We must elegantly handle existing data! We map all existing data 
-- to a "default" tenant natively to ensure zero-downtime upgrades.

INSERT INTO tenants (id, name, domain) 
VALUES (1, 'Sayona Primary', 'sayona.local') 
ON CONFLICT DO NOTHING;

-- 2. Inject tenant_id across all aggregates (Safe Schema Alteration)
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id) DEFAULT 1;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id) DEFAULT 1;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id) DEFAULT 1;

-- 3. Enhance indices to always prepend tenant_id for heavily partitioned scaling
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tenant ON shipments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quotes_tenant ON quotes(tenant_id);
