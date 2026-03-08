-- ═══════════════════════════════════════════════════════════════
-- Enterprise Schema Migration — Sayona Shipping Service
-- Version: 001
-- WARNING: This migration drops and recreates tables. 
-- BACK UP YOUR DATABASE BEFORE RUNNING.
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────── Note: Drop statements removed for safety ───────────────

-- ═══════════════════════════════════════
-- USERS — Unified users table with RBAC
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
    id                    SERIAL PRIMARY KEY,
    uuid                  UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name                  VARCHAR(100) NOT NULL,
    email                 VARCHAR(255) UNIQUE NOT NULL,
    password_hash         TEXT NOT NULL,
    phone                 VARCHAR(20),
    company               VARCHAR(150),
    role                  VARCHAR(50) DEFAULT 'client' CHECK (role IN ('admin', 'staff', 'client', 'warehouse_staff', 'delivery_agent')),
    address               TEXT,
    is_verified           BOOLEAN DEFAULT FALSE,
    is_locked             BOOLEAN DEFAULT FALSE,
    failed_login_attempts INTEGER DEFAULT 0,
    lock_until            TIMESTAMP,
    password_reset_token  TEXT,
    password_reset_expires TIMESTAMP,
    email_verification_token TEXT,
    created_at            TIMESTAMP DEFAULT NOW(),
    updated_at            TIMESTAMP DEFAULT NOW(),
    deleted_at            TIMESTAMP,
    version               INTEGER DEFAULT 1
);

-- ═══════════════════════════════════════
-- REFRESH TOKENS
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token       TEXT NOT NULL UNIQUE,
    expires_at  TIMESTAMP NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- SHIPMENTS
-- ═══════════════════════════════════════
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shipment_status') THEN
        CREATE TYPE shipment_status AS ENUM (
            'CREATED', 'PICKED_UP', 'IN_TRANSIT', 'ARRIVED_AT_WAREHOUSE', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_DELIVERY', 'RETURNED'
        );
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS shipments (
    id              SERIAL PRIMARY KEY,
    uuid            UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    sender_name     VARCHAR(100) NOT NULL,
    receiver_name   VARCHAR(100) NOT NULL,
    origin          VARCHAR(200) NOT NULL,
    destination     VARCHAR(200) NOT NULL,
    status          shipment_status DEFAULT 'CREATED',
    shipping_type   VARCHAR(50) DEFAULT 'standard',
    price           NUMERIC(10, 2) DEFAULT 0.00,
    weight          NUMERIC(10, 2),
    dimensions      VARCHAR(100),
    industry_type   VARCHAR(50) DEFAULT 'General',
    created_by      INTEGER REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    deleted_at      TIMESTAMP,
    version         INTEGER DEFAULT 1
);

-- ═══════════════════════════════════════
-- PACKAGES
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS packages (
    id              SERIAL PRIMARY KEY,
    uuid            UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    shipment_id     INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
    weight          NUMERIC(10, 2),
    height          NUMERIC(10, 2),
    width           NUMERIC(10, 2),
    length          NUMERIC(10, 2),
    fragile         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- WAREHOUSES
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS warehouses (
    id              SERIAL PRIMARY KEY,
    uuid            UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name            VARCHAR(200) NOT NULL,
    location        VARCHAR(255) NOT NULL,
    capacity        INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- CARRIERS
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS carriers (
    id              SERIAL PRIMARY KEY,
    uuid            UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name            VARCHAR(200) NOT NULL,
    service_type    VARCHAR(100) NOT NULL,
    contact         VARCHAR(255),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- SHIPMENT ASSIGNMENTS
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS shipment_assignments (
    id                  SERIAL PRIMARY KEY,
    uuid                UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    shipment_id         INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
    delivery_agent_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    assigned_by         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    status              VARCHAR(50) DEFAULT 'assigned' CHECK (status IN ('assigned', 'accepted', 'in_progress', 'completed', 'failed')),
    assigned_at         TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- SHIPMENT ROUTES
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS shipment_routes (
    id                  SERIAL PRIMARY KEY,
    uuid                UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    shipment_id         INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
    warehouse_id        INTEGER REFERENCES warehouses(id) ON DELETE CASCADE,
    sequence_order      INTEGER NOT NULL,
    arrival_time        TIMESTAMP,
    departure_time      TIMESTAMP,
    status              VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'arrived', 'departed')),
    created_at          TIMESTAMP DEFAULT NOW(),
    updated_at          TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- TRACKING EVENTS
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS tracking_events (
    id              SERIAL PRIMARY KEY,
    uuid            UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    shipment_id     INTEGER REFERENCES shipments(id) ON DELETE CASCADE,
    tracking_number VARCHAR(50) NOT NULL,
    location        VARCHAR(200) NOT NULL,
    status          shipment_status NOT NULL,
    description     TEXT,
    created_by      INTEGER REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- QUOTES
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS quotes (
    id           SERIAL PRIMARY KEY,
    uuid         UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name         VARCHAR(100) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    phone        VARCHAR(20),
    company      VARCHAR(150),
    origin       VARCHAR(200) NOT NULL,
    destination  VARCHAR(200) NOT NULL,
    cargo_type   VARCHAR(100),
    weight       VARCHAR(50),
    message      TEXT,
    status       VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'quoted', 'accepted', 'rejected')),
    reviewed_by  INTEGER REFERENCES users(id),
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW(),
    deleted_at   TIMESTAMP,
    version      INTEGER DEFAULT 1
);

-- ═══════════════════════════════════════
-- CONTACTS
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS contacts (
    id         SERIAL PRIMARY KEY,
    uuid       UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    phone      VARCHAR(20),
    subject    VARCHAR(255) DEFAULT 'General Inquiry',
    message    TEXT NOT NULL,
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- ═══════════════════════════════════════
-- AUDIT LOGS
-- ═══════════════════════════════════════
CREATE TABLE IF NOT EXISTS audit_logs (
    id          SERIAL PRIMARY KEY,
    uuid        UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   INTEGER,
    old_values  JSONB,
    new_values  JSONB,
    ip_address  INET,
    user_agent  TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_created ON shipments(created_at);
CREATE INDEX IF NOT EXISTS idx_shipments_user ON shipments(user_id);
CREATE INDEX IF NOT EXISTS idx_shipments_deleted ON shipments(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_packages_shipment ON packages(shipment_id);

CREATE INDEX IF NOT EXISTS idx_tracking_shipment ON tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_tracking_number ON tracking_events(tracking_number);
CREATE INDEX IF NOT EXISTS idx_tracking_created ON tracking_events(created_at);

CREATE INDEX IF NOT EXISTS idx_assignments_shipment ON shipment_assignments(shipment_id);
CREATE INDEX IF NOT EXISTS idx_assignments_agent ON shipment_assignments(delivery_agent_id);

CREATE INDEX IF NOT EXISTS idx_routes_shipment ON shipment_routes(shipment_id);
CREATE INDEX IF NOT EXISTS idx_routes_warehouse ON shipment_routes(warehouse_id);

CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_deleted ON quotes(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_contacts_read ON contacts(is_read);
CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- ═══════════════════════════════════════
-- AUTO-UPDATE TRIGGERS
-- ═══════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = COALESCE(OLD.version, 0) + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_shipments_updated_at ON shipments;
CREATE TRIGGER trg_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_assignments_updated_at ON shipment_assignments;
CREATE TRIGGER trg_assignments_updated_at
    BEFORE UPDATE ON shipment_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_routes_updated_at ON shipment_routes;
CREATE TRIGGER trg_routes_updated_at
    BEFORE UPDATE ON shipment_routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_quotes_updated_at ON quotes;
CREATE TRIGGER trg_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
