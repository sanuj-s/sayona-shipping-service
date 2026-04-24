-- ═══════════════════════════════════════════════════════════════
-- SaaS Multi-Tenancy Architecture
-- Version: 006
-- Converts system to Logstics-as-a-Service with strict Row-Level Security
-- ═══════════════════════════════════════════════════════════════

-- 1. Create the new UUID-based tenants table
-- We drop the old integer-based tenants table if it existed from v005
DROP TABLE IF EXISTS tenants CASCADE;

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain VARCHAR(255) UNIQUE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create the Default Tenant for existing data migration
INSERT INTO tenants (id, name, domain) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Sayona Logistics Platform', 'sayona.local');

-- 3. Prepare tables (drop old integer tenant_id if present from 005)
DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN SELECT unnest(ARRAY['users', 'refresh_tokens', 'shipments', 'packages', 'warehouses', 'carriers', 'shipment_assignments', 'shipment_routes', 'tracking_events', 'quotes', 'contacts', 'api_keys', 'audit_logs'])
    LOOP
        EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS tenant_id CASCADE', t_name);
    END LOOP;
END $$;

-- 4. Inject UUID tenant_id into all core tables with default value
DO $$
DECLARE
    t_name text;
BEGIN
    FOR t_name IN SELECT unnest(ARRAY['users', 'refresh_tokens', 'shipments', 'packages', 'warehouses', 'carriers', 'shipment_assignments', 'shipment_routes', 'tracking_events', 'quotes', 'contacts', 'api_keys', 'audit_logs'])
    LOOP
        -- Add column with default mapped to the primary tenant
        EXECUTE format('ALTER TABLE %I ADD COLUMN tenant_id UUID DEFAULT ''00000000-0000-0000-0000-000000000000''', t_name);
        
        -- Enforce foreign key
        EXECUTE format('ALTER TABLE %I ADD CONSTRAINT fk_%I_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE', t_name, t_name);
        
        -- Enforce NOT NULL
        EXECUTE format('ALTER TABLE %I ALTER COLUMN tenant_id SET NOT NULL', t_name);
        
        -- Create index
        EXECUTE format('CREATE INDEX idx_%I_tenant_id ON %I(tenant_id)', t_name, t_name);
        
        -- Enable RLS
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t_name);
        
        -- Create RLS Policy
        EXECUTE format('CREATE POLICY tenant_isolation ON %I USING (tenant_id = current_setting(''app.current_tenant'', true)::uuid)', t_name);
    END LOOP;
END $$;
