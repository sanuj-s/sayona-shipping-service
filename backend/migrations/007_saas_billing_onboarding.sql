-- ═══════════════════════════════════════════════════════════════
-- SaaS Billing, Onboarding & Hardening
-- Version: 007
-- Introduces subscription plans, strict tenant lifecycles, composite identities,
-- and cached counters with trigger-based maintenance.
-- ═══════════════════════════════════════════════════════════════

-- 1. Normalized Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    shipment_limit INT NOT NULL DEFAULT 50,
    user_limit INT NOT NULL DEFAULT 5,
    price INT NOT NULL DEFAULT 0
);

INSERT INTO plans (id, name, shipment_limit, user_limit, price) VALUES
('free', 'Free Tier', 50, 5, 0),
('pro', 'Pro Tier', 500, 20, 99),
('enterprise', 'Enterprise Tier', -1, -1, 499)
ON CONFLICT (id) DO NOTHING;

-- 2. Tenant Lifecycle & Billing Caching
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS plan_id TEXT REFERENCES plans(id) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
ADD COLUMN IF NOT EXISTS shipment_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS user_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS theme_color VARCHAR(50) DEFAULT '#0F172A';

-- Update Default Tenant's Email
UPDATE tenants SET email = 'admin@sayona.local' WHERE id = '00000000-0000-0000-0000-000000000000' AND email IS NULL;

-- 3. Composite Identity for Users
-- Although we enforce global uniqueness on email for login simplicity, 
-- this composite index protects against cross-tenant data collisions structurally.
CREATE UNIQUE INDEX IF NOT EXISTS users_tenant_email_unique ON users(tenant_id, email);

-- Update Roles to include explicit SaaS hierarchy
-- Since role is currently a simple VARCHAR with a CHECK constraint in v001:
-- `role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('admin', 'staff', 'client', 'warehouse_staff', 'delivery_agent'))`
-- We will relax the check constraint to support 'manager' and 'operator'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'manager', 'operator', 'staff', 'client', 'warehouse_staff', 'delivery_agent'));


-- 4. Triggers for High-Performance Cached Counters

-- 4a. Shipments Counter Trigger
CREATE OR REPLACE FUNCTION update_shipment_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT
    IF TG_OP = 'INSERT' THEN
        UPDATE tenants SET shipment_count = shipment_count + 1 WHERE id = NEW.tenant_id;
    -- Handle DELETE (Hard Delete)
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tenants SET shipment_count = shipment_count - 1 WHERE id = OLD.tenant_id;
    -- Handle UPDATE (Soft Delete or Tenant Transfer)
    ELSIF TG_OP = 'UPDATE' THEN
        -- Case 1: Soft Delete (deleted_at transitions from NULL to NOT NULL)
        IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
            UPDATE tenants SET shipment_count = shipment_count - 1 WHERE id = NEW.tenant_id;
        -- Case 2: Soft Undelete (deleted_at transitions from NOT NULL to NULL)
        ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
            UPDATE tenants SET shipment_count = shipment_count + 1 WHERE id = NEW.tenant_id;
        -- Case 3: Tenant Transfer (Highly unlikely but architecturally sound)
        ELSIF OLD.tenant_id != NEW.tenant_id THEN
            IF OLD.deleted_at IS NULL THEN
                UPDATE tenants SET shipment_count = shipment_count - 1 WHERE id = OLD.tenant_id;
            END IF;
            IF NEW.deleted_at IS NULL THEN
                UPDATE tenants SET shipment_count = shipment_count + 1 WHERE id = NEW.tenant_id;
            END IF;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_shipment_count ON shipments;
CREATE TRIGGER trg_update_shipment_count
    AFTER INSERT OR UPDATE OR DELETE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_shipment_count();

-- 4b. Users Counter Trigger
CREATE OR REPLACE FUNCTION update_user_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tenants SET user_count = user_count + 1 WHERE id = NEW.tenant_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tenants SET user_count = user_count - 1 WHERE id = OLD.tenant_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
            UPDATE tenants SET user_count = user_count - 1 WHERE id = NEW.tenant_id;
        ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
            UPDATE tenants SET user_count = user_count + 1 WHERE id = NEW.tenant_id;
        ELSIF OLD.tenant_id != NEW.tenant_id THEN
            IF OLD.deleted_at IS NULL THEN
                UPDATE tenants SET user_count = user_count - 1 WHERE id = OLD.tenant_id;
            END IF;
            IF NEW.deleted_at IS NULL THEN
                UPDATE tenants SET user_count = user_count + 1 WHERE id = NEW.tenant_id;
            END IF;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_user_count ON users;
CREATE TRIGGER trg_update_user_count
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION update_user_count();

-- 5. DB-Level Limit Enforcement (Race-Condition Safe)
CREATE OR REPLACE FUNCTION enforce_shipment_limit()
RETURNS TRIGGER AS $$
DECLARE
    t_limit INT;
    t_count INT;
BEGIN
    SELECT p.shipment_limit, t.shipment_count INTO t_limit, t_count
    FROM tenants t JOIN plans p ON t.plan_id = p.id
    WHERE t.id = NEW.tenant_id;
    
    IF t_limit != -1 AND t_count >= t_limit THEN
        RAISE EXCEPTION 'Plan limit reached for shipments'
            USING ERRCODE = 'P0001'; -- raise generic exception code
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_shipment_limit ON shipments;
CREATE TRIGGER trg_enforce_shipment_limit
    BEFORE INSERT ON shipments
    FOR EACH ROW EXECUTE FUNCTION enforce_shipment_limit();

CREATE OR REPLACE FUNCTION enforce_user_limit()
RETURNS TRIGGER AS $$
DECLARE
    t_limit INT;
    t_count INT;
BEGIN
    SELECT p.user_limit, t.user_count INTO t_limit, t_count
    FROM tenants t JOIN plans p ON t.plan_id = p.id
    WHERE t.id = NEW.tenant_id;
    
    IF t_limit != -1 AND t_count >= t_limit THEN
        RAISE EXCEPTION 'Plan limit reached for users'
            USING ERRCODE = 'P0001';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_user_limit ON users;
CREATE TRIGGER trg_enforce_user_limit
    BEFORE INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION enforce_user_limit();

-- 6. Backfill counters for the Default Tenant
DO $$
BEGIN
    UPDATE tenants t
    SET shipment_count = (SELECT COUNT(*) FROM shipments s WHERE s.tenant_id = t.id AND s.deleted_at IS NULL),
        user_count = (SELECT COUNT(*) FROM users u WHERE u.tenant_id = t.id AND u.deleted_at IS NULL);
END $$;
