-- ═══════════════════════════════════════════════════════════════
-- Enterprise Schema Migration — Sayona Shipping Service
-- Version: 001
-- WARNING: This migration drops and recreates tables. 
-- BACK UP YOUR DATABASE BEFORE RUNNING.
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────── Drop old tables (order matters for foreign keys) ───────────────
DROP TABLE IF EXISTS tracking CASCADE;
DROP TABLE IF EXISTS quote_requests CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ─────────────── Drop old types if exist ───────────────
DROP TYPE IF EXISTS shipment_status CASCADE;

-- ═══════════════════════════════════════
-- USERS — Unified users table with RBAC
-- ═══════════════════════════════════════
CREATE TABLE users (
    id                    SERIAL PRIMARY KEY,
    uuid                  UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    name                  VARCHAR(100) NOT NULL,
    email                 VARCHAR(255) UNIQUE NOT NULL,
    password_hash         TEXT NOT NULL,
    phone                 VARCHAR(20),
    company               VARCHAR(150),
    role                  VARCHAR(20) DEFAULT 'client' CHECK (role IN ('admin', 'staff', 'client')),
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
CREATE TABLE refresh_tokens (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token       TEXT NOT NULL UNIQUE,
    expires_at  TIMESTAMP NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- ═══════════════════════════════════════
-- SHIPMENTS
-- ═══════════════════════════════════════
CREATE TYPE shipment_status AS ENUM (
    'CREATED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'
);

CREATE TABLE shipments (
    id              SERIAL PRIMARY KEY,
    uuid            UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id         INTEGER REFERENCES users(id) ON DELETE SET NULL,
    sender_name     VARCHAR(100) NOT NULL,
    receiver_name   VARCHAR(100) NOT NULL,
    origin          VARCHAR(200) NOT NULL,
    destination     VARCHAR(200) NOT NULL,
    status          shipment_status DEFAULT 'CREATED',
    industry_type   VARCHAR(50) DEFAULT 'General',
    created_by      INTEGER REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),
    deleted_at      TIMESTAMP,
    version         INTEGER DEFAULT 1
);

-- ═══════════════════════════════════════
-- TRACKING EVENTS
-- ═══════════════════════════════════════
CREATE TABLE tracking_events (
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
CREATE TABLE quotes (
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
CREATE TABLE contacts (
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
CREATE TABLE audit_logs (
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
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_deleted ON users(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

CREATE INDEX idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created ON shipments(created_at);
CREATE INDEX idx_shipments_user ON shipments(user_id);
CREATE INDEX idx_shipments_deleted ON shipments(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_tracking_shipment ON tracking_events(shipment_id);
CREATE INDEX idx_tracking_number ON tracking_events(tracking_number);
CREATE INDEX idx_tracking_created ON tracking_events(created_at);

CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created ON quotes(created_at);
CREATE INDEX idx_quotes_deleted ON quotes(deleted_at) WHERE deleted_at IS NULL;

CREATE INDEX idx_contacts_read ON contacts(is_read);
CREATE INDEX idx_contacts_created ON contacts(created_at);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

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

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_quotes_updated_at
    BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
