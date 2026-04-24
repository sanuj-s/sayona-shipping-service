# Sayona Shipping Service

> Enterprise Logistics-as-a-Service — real-time shipment tracking, quote management, full admin operations, and multi-tenant SaaS billing. Built with Node.js, PostgreSQL, Redis, and a Next.js frontend.

[![Deploy to EC2](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/deploy-ec2.yml/badge.svg)](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/deploy-ec2.yml)
[![CI/CD](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/ci.yml/badge.svg)](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)](https://postgresql.org)
[![Version](https://img.shields.io/badge/version-2.0.0-blue)](package.json)

---

## Overview

Sayona Shipping Service v2.0 is a full-stack **Logistics-as-a-Service (LaaS)** platform. Starting from v1's monolith, the system has been upgraded to a proper SaaS architecture with true multi-tenancy, subscription billing, a self-service company onboarding flow, and a live EC2 deployment pipeline.

The backend implements production SaaS patterns: repository pattern, domain state machines, distributed locking, idempotency, outbox pattern, event bus, **PostgreSQL Row-Level Security**, **subscription plans with DB-level limit enforcement**, and a full observability stack.

---

## What's New in v2.0

### Architecture: Monolith → SaaS Platform

The most significant update is the complete transformation into a multi-tenant SaaS system. Every existing table (`users`, `shipments`, `tracking_events`, `quotes`, etc.) now carries a `tenant_id` UUID column with a foreign key to the `tenants` table, a non-null constraint, and an RLS policy that isolates rows by `app.current_tenant`. The default tenant (`00000000-0000-0000-0000-000000000000`) covers all legacy/single-tenant data.

#### Migration 006 — SaaS Multi-Tenancy (`006_saas_multi_tenancy.sql`)

- Drops the old integer-based `tenants` table and replaces it with a UUID-based one.
- Injects `tenant_id UUID` into all 13 core tables via a dynamic PL/pgSQL loop.
- Enables PostgreSQL **Row-Level Security** on every table.
- Creates `tenant_isolation` RLS policies: `USING (tenant_id = current_setting('app.current_tenant', true)::uuid)`.
- Inserts a **default tenant** (`00000000-...`) for backward compatibility with all existing data.

#### Migration 007 — SaaS Billing and Onboarding (`007_saas_billing_onboarding.sql`)

- Introduces a normalized `plans` table with three tiers: `free` (50 shipments / 5 users), `pro` (500 / 20, $99/mo), and `enterprise` (unlimited, $499/mo).
- Adds billing columns to `tenants`: `email`, `plan_id`, `status`, `shipment_count`, `user_count`, `logo_url`, `theme_color`.
- Adds a **composite unique index** `users_tenant_email_unique` for cross-tenant email collision protection.
- Expands the role CHECK constraint to include `manager` and `operator` (in addition to the original five roles).
- Implements **trigger-based cached counters** (`trg_update_shipment_count`, `trg_update_user_count`) that automatically maintain `tenants.shipment_count` and `tenants.user_count` on every insert, delete, and soft-delete transition — zero extra queries needed at the application layer.
- Implements **DB-level plan limit enforcement** (`trg_enforce_shipment_limit`, `trg_enforce_user_limit`) as `BEFORE INSERT` triggers, making limits race-condition-safe even under concurrent load.
- Backfills counters for the default tenant.

### New API Endpoints

#### Company Onboarding

`POST /api/v1/auth/register-company` replaces the old `/api/v1/auth/register` for SaaS onboarding. It creates a **tenant and an admin user in a single atomic transaction**:

```json
{
  "companyName": "Acme Logistics",
  "email": "admin@acme.com",
  "password": "strongpassword",
  "domain": "acme.com"
}
```

Returns JWT access/refresh tokens immediately — the new admin is logged in right after workspace creation.

#### User Invitation

`POST /api/v1/auth/invite-user` (protected) lets a workspace admin invite teammates. The invited user is created within the same tenant scope. Invited users are auto-assigned the `operator` role unless explicitly set to `admin` or `manager`.

#### Tenant Billing

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/tenants/usage` | User | Get current shipment/user count vs plan limits |
| `POST` | `/api/v1/tenants/upgrade-plan` | Admin | Change subscription plan |

#### Plan limit enforcement at the middleware layer

`src/middlewares/billing.middleware.js` provides `checkShipmentLimit` and `checkUserLimit`. These run a `SELECT ... FOR UPDATE` inside a transaction before allowing creation, protecting against race conditions at the application layer (the DB trigger is the final safety net).

### New Frontend Pages

#### `/register-company` — Workspace Onboarding Page

A public-facing page where a company signs up for the platform. Calls `POST /api/v1/auth/register-company` and, on success, logs the user in directly and redirects to the admin dashboard. Links to admin login for existing accounts.

#### `/admin/billing` — Billing & Subscription Dashboard

An admin-protected page showing:
- Current plan name and price.
- Shipment usage with a progress bar (e.g., "38 / 50 shipments").
- User usage with a progress bar.
- Plan upgrade buttons (Free → Pro → Enterprise).
- "Unlimited" indicator for Enterprise plans.

The admin sidebar now contains a **"Billing & Plan"** navigation item linking to this page.

### New UI Components

#### `WhatsAppButton`

A fixed floating button rendered at `bottom-right` on all pages. Links to `wa.me/919790057690` (configured in `SITE.whatsapp` in `lib/utils/constants.ts`). Uses a CSS custom property `--color-whatsapp` and a pulse animation (`animate-whatsapp-pulse`). Stacks above the mobile CTA bar on small screens via `--z-mobile-cta`.

#### `MobileCTABar`

A fixed full-width bar anchored to the bottom of the screen on mobile (`lg:hidden`). Contains a single "Get a Free Quote" button linking to `/contact#quote`. Added to the public layout wrapper — it appears on every public marketing page automatically. Uses `safe-area-pb` for safe area insets on notched devices.

Both components are wired into `src/app/(public)/layout.tsx`:

```tsx
<Navbar />
<main>{children}</main>
<Footer />
<MobileCTABar />   {/* ← new */}
{/* WhatsAppButton is rendered inside Footer or a global provider */}
```

### New Role Hierarchy

Two new roles have been added to support multi-tenant team structures:

| Role | Level | Description |
|---|---|---|
| `admin` | 4 | Full access, can manage billing and users |
| `manager` | 3.5 | New — team lead level (between staff and admin) |
| `operator` | 3 | New — default role for invited users |
| `staff` | 3 | Legacy staff role |
| `warehouse_staff` | 2 | Warehouse operations |
| `delivery_agent` | 1 | Delivery operations |
| `client` | 0 | Self-service portal |

### Live EC2 Deployment Pipeline

A new GitHub Actions workflow (`.github/workflows/deploy-ec2.yml`) automates production deployment to AWS EC2 (`ap-south-1`) on every push to `main`:

1. Builds the Next.js frontend (`npm run build` → static export to `frontend/out/`).
2. Validates the build directory exists before proceeding.
3. **Dynamically whitelists the runner's public IP** in the EC2 security group for SSH access, then revokes it after deployment (runs in `always()` to clean up even on failure).
4. SSHs in to free disk space (Docker prune, npm cache, log rotation, Nginx reload).
5. SCPs the `frontend/out/` directory to the server.
6. On the server: `git pull`, `npm ci`, `npm run migrate`, `node scripts/seed.js`, `pm2 reload app`.
7. Sets filesystem permissions: `ubuntu:www-data` with `750` so Nginx can traverse and serve static files.

Required GitHub secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SECURITY_GROUP_ID`, `EC2_HOST`, `EC2_USER`, `EC2_KEY`.

### Infrastructure Additions

- `backend/ecosystem.config.js` — PM2 process manager config for production process control.
- `backend/nginx.conf` and `backend/nginx/nginx.conf` + `backend/nginx/sayonashipping.conf` — Nginx reverse proxy and static file serving configuration.
- `backend/prometheus.yml` — Prometheus scrape config targeting the `/api/v1/metrics` endpoint.
- `backend/debug-env.js` — A utility script for safely inspecting resolved environment variables during debugging.
- `frontend/nginx-sayona.conf` — Nginx location block config for serving the static Next.js export.
- `robots.txt` and `sitemap.xml` at the repo root (served via Nginx) for SEO.
- `frontend/CLAUDE.md` and `frontend/AGENTS.md` — Instructions for AI coding agents working in the frontend codebase.

### AsyncLocalStorage for Tenant Context

`src/config/database.js` now exports `tenantStorage`, a `AsyncLocalStorage` instance from Node's `async_hooks`. The custom `query()` wrapper checks `tenantStorage.getStore()` on every call. If a tenant ID is present, the query runs inside an explicit transaction with `SET LOCAL app.current_tenant = '<uuid>'` before execution, activating PostgreSQL's RLS policies for that request's entire async call stack.

This design means services and repositories need zero changes — they all call `query()` as before, and tenant isolation is enforced transparently at the DB layer.

The new idempotency middleware file (`idempotency.middleware.js`) is a Redis-backed implementation that supersedes the older `idempotency.js`. Both files currently coexist; `idempotency.middleware.js` is the authoritative version.

### Postman Collection Restructure

The Postman workspace has been reorganized into `postman/collections/` and `postman/globals/workspace.globals.yaml`. The previous `.postman/resources.yaml` still exists for legacy reference.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ + Express 5 |
| Database | PostgreSQL 15 (custom migration scripts + RLS) |
| Cache / Queue | Redis + BullMQ |
| Authentication | JWT (access + refresh tokens) + bcrypt |
| Validation | Joi schema validation |
| Observability | OpenTelemetry + Jaeger + Prometheus + Winston |
| Email | Nodemailer |
| PDF / Labels | PDFKit + QRCode |
| Search | Elasticsearch |
| Frontend | Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 |
| State (FE) | Zustand + TanStack React Query |
| Animations | Framer Motion |
| Infra | Docker, Docker Compose, Nginx, PM2 |
| CI/CD | GitHub Actions (lint → test → security → deploy gate + EC2 deploy) |
| Process Manager | PM2 (`ecosystem.config.js`) |

---

## Architecture

```
sayona-shipping-service/
├── backend/                         ← Node.js REST API (v2.0.0)
│   └── src/
│       ├── routes/
│       │   └── v1/
│       │       ├── auth.routes.js          ← Includes /register-company, /invite-user
│       │       ├── tenant.routes.js        ← NEW: /usage, /upgrade-plan
│       │       ├── shipments, tracking, quotes, contacts, admin, docs, metrics
│       ├── controllers/
│       │   ├── tenant.controller.js        ← NEW: getUsage, upgradePlan
│       │   └── auth.controller.js          ← Updated: registerCompany, inviteUser
│       ├── services/
│       │   ├── auth.service.js             ← Updated: registerCompany (atomic txn), inviteUser
│       │   └── [all other services unchanged]
│       ├── middlewares/
│       │   ├── billing.middleware.js        ← NEW: checkShipmentLimit, checkUserLimit
│       │   ├── idempotency.middleware.js    ← NEW: Redis-backed idempotency (authoritative)
│       │   ├── tenantScope.js              ← Multi-tenant request isolation
│       │   └── [all other middlewares unchanged]
│       ├── models/schemas.js               ← Updated: manager, operator roles added
│       └── config/
│           └── database.js                 ← Updated: AsyncLocalStorage + RLS query wrapper
│   ├── migrations/
│   │   ├── 000_migration_tracking.sql
│   │   ├── 001_enterprise_schema.sql
│   │   ├── 002_token_security.sql
│   │   ├── 003_webhooks.sql
│   │   ├── 004_outbox_pattern.sql
│   │   ├── 005_multi_tenancy.sql
│   │   ├── 006_saas_multi_tenancy.sql      ← NEW: UUID tenants + RLS policies
│   │   └── 007_saas_billing_onboarding.sql ← NEW: plans, counters, triggers
│   ├── ecosystem.config.js                 ← NEW: PM2 config
│   ├── nginx.conf / nginx/                 ← NEW: Nginx reverse proxy configs
│   └── prometheus.yml                      ← NEW: Prometheus scrape config
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (public)/
│       │   │   ├── layout.tsx              ← Updated: MobileCTABar added
│       │   │   └── register-company/       ← NEW: SaaS onboarding page
│       │   ├── (admin)/admin/(protected)/
│       │   │   └── billing/page.tsx        ← NEW: Billing & subscription dashboard
│       ├── components/
│       │   ├── layout/
│       │   │   ├── mobile-cta-bar.tsx      ← NEW: Fixed mobile "Get a Free Quote" bar
│       │   │   └── whatsapp-button.tsx     ← NEW: Floating WhatsApp chat button
│       │   └── admin/sidebar.tsx           ← Updated: "Billing & Plan" nav item added
│       └── CLAUDE.md / AGENTS.md           ← NEW: AI agent coding instructions
├── .github/workflows/
│   └── deploy-ec2.yml                      ← NEW: Automated EC2 deployment pipeline
├── postman/
│   ├── collections/                        ← Restructured Postman workspace
│   └── globals/workspace.globals.yaml
├── robots.txt                              ← NEW: SEO
└── sitemap.xml                             ← NEW: SEO
```

---

## Database Schema Overview

### Tenants (`tenants`)

| Column | Type | Description |
|---|---|---|
| `id` | UUID (PK) | Tenant identifier |
| `name` | TEXT | Company name |
| `email` | VARCHAR(255) UNIQUE | Billing contact |
| `domain` | VARCHAR(255) UNIQUE | Optional custom domain |
| `plan_id` | TEXT → `plans.id` | Active subscription plan |
| `status` | VARCHAR(20) | `active`, `suspended`, `cancelled` |
| `shipment_count` | INT | Cached counter, maintained by triggers |
| `user_count` | INT | Cached counter, maintained by triggers |
| `logo_url` | TEXT | Brand logo URL |
| `theme_color` | VARCHAR(50) | Brand hex color, default `#0F172A` |

### Plans (`plans`)

| Plan | Shipments | Users | Price |
|---|---|---|---|
| `free` | 50 | 5 | $0 |
| `pro` | 500 | 20 | $99/mo |
| `enterprise` | Unlimited | Unlimited | $499/mo |

A limit of `-1` means unlimited. Enforced by both `billing.middleware.js` (application layer) and DB triggers (database layer).

### Row-Level Security Policies

Every core table has an RLS policy of the form:

```sql
CREATE POLICY tenant_isolation ON <table>
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
```

The setting `app.current_tenant` is injected per-query via `SET LOCAL` inside the `database.js` query wrapper when `tenantStorage.getStore()` returns a non-null UUID.

---

## API Reference

Full Swagger UI: **`http://localhost:3000/api/v1/docs`**

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register-company` | Public | Create tenant + admin user in one transaction |
| `POST` | `/api/v1/auth/invite-user` | Admin | Invite a teammate to the current workspace |
| `POST` | `/api/v1/auth/login` | Public | Login, returns JWT pair |
| `POST` | `/api/v1/auth/logout` | User | Revoke refresh token |
| `POST` | `/api/v1/auth/refresh` | Public | Get new access token |
| `POST` | `/api/v1/auth/forgot-password` | Public | Request password reset |
| `POST` | `/api/v1/auth/reset-password` | Public | Complete password reset |
| `GET` | `/api/v1/auth/verify-email/:token` | Public | Verify email address |
| `GET` | `/api/v1/auth/me` | User | Get current user |
| `PUT` | `/api/v1/auth/profile` | User | Update profile |

### Tenants (Billing)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/tenants/usage` | User | Current usage vs plan limits |
| `POST` | `/api/v1/tenants/upgrade-plan` | Admin | Switch subscription plan |

### Shipments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/shipments` | Staff+ | List shipments (paginated) |
| `POST` | `/api/v1/shipments` | Staff+ | Create shipment (idempotent) |
| `GET` | `/api/v1/shipments/:uuid` | User | Get shipment by UUID |
| `PUT` | `/api/v1/shipments/:uuid` | Staff+ | Update shipment (idempotent) |
| `DELETE` | `/api/v1/shipments/:uuid` | Admin | Soft-delete shipment |

### Tracking

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/tracking/:trackingNumber` | Public | Get full tracking timeline |
| `POST` | `/api/v1/tracking` | Staff+ | Add a tracking event |

### Quotes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/quotes` | Public | Submit quote request (idempotent) |
| `GET` | `/api/v1/quotes/estimate` | Public | Get instant price estimate |
| `GET` | `/api/v1/quotes` | Staff+ | List all quotes |
| `PUT` | `/api/v1/quotes/:uuid/status` | Staff+ | Update quote status |
| `POST` | `/api/v1/quotes/:uuid/reply` | Staff+ | Reply to quote via email |

### Contacts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/contacts` | Public | Submit contact form |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | Admin | Analytics dashboard |
| `GET` | `/api/v1/admin/users` | Admin | List all users |
| `PUT` | `/api/v1/admin/users/:uuid` | Admin | Update user |
| `GET` | `/api/v1/admin/audit-logs` | Admin | Immutable audit log |
| `GET` | `/api/v1/admin/contacts` | Staff+ | View contact submissions |
| `PUT` | `/api/v1/admin/contacts/:uuid/read` | Staff+ | Mark contact as read |

### System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | Public | Health check (reports version `2.0.0`) |
| `GET` | `/api/v1/metrics` | Public | Prometheus metrics |
| `GET` | `/api/v1/docs` | Public | Swagger UI |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v15+
- Redis
- Docker + Docker Compose *(optional)*

---

### Option A — Docker (recommended)

```bash
git clone https://github.com/sanuj-s/sayona-shipping-service.git
cd sayona-shipping-service

cp backend/.env.example backend/.env
# Edit backend/.env with your values

docker-compose up -d
```

Migrations (including `006` and `007`) and seeding run automatically via `npm run start:bootstrap`. API is available at `http://localhost:3000/api/v1`.

---

### Option B — Local Development

**1. Clone and set up the database**

```bash
git clone https://github.com/sanuj-s/sayona-shipping-service.git
cd sayona-shipping-service
```

```sql
CREATE DATABASE sayona_shipping;
```

**2. Configure environment**

```bash
cd backend
cp .env.example .env
# Edit .env
```

**3. Run backend**

```bash
npm install
npm run setup   # Runs all 8 migrations + seeds admin/staff users
npm run dev
```

**4. Run frontend**

```bash
cd ../frontend
npm install
npm run dev
```

Frontend: `http://localhost:3001`

**5. Run background worker** *(optional)*

```bash
cd backend && npm run worker
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `BASE_URL` | Public-facing URL | `http://localhost:3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | DB username | `postgres` |
| `DB_PASSWORD` | DB password | `yourpassword` |
| `DB_NAME` | Database name | `sayona_shipping` |
| `DB_POOL_MAX` | Max pool connections | `20` |
| `DB_IDLE_TIMEOUT` | Pool idle timeout (ms) | `30000` |
| `DB_CONN_TIMEOUT` | Connection timeout (ms) | `5000` |
| `JWT_SECRET` | Access token secret (32+ chars) | *(generate randomly)* |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) | *(generate randomly)* |
| `JWT_ACCESS_EXPIRY` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token TTL | `7d` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:3001` |
| `RATE_LIMIT_MAX` | Max API requests per 15 min | `100` |
| `RATE_LIMIT_AUTH_MAX` | Max auth attempts per 15 min | `10` |
| `RATE_LIMIT_FORM_MAX` | Max form submissions per 15 min | `5` |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor (10–14) | `12` |
| `MAX_LOGIN_ATTEMPTS` | Attempts before account lock | `5` |
| `LOCK_DURATION_MS` | Lock duration in ms | `1800000` |
| `BODY_LIMIT` | Max request body size | `1mb` |
| `LOG_LEVEL` | Winston log level | `debug` / `info` |
| `LOG_DIR` | Log output directory | `./logs` |
| `REQUEST_TIMEOUT_MS` | Per-request timeout | `30000` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_URL` | Redis URL (alternative) | `redis://localhost:6379` |
| `EMAIL_USER` | SMTP username | `you@gmail.com` |
| `EMAIL_PASS` | SMTP app password | *(set securely)* |
| `ENABLE_TRACING` | Enable OpenTelemetry | `false` |
| `JAEGER_ENDPOINT` | Jaeger collector URL | `http://localhost:14268/api/traces` |
| `SERVICE_NAME` | Microservice mode | `monolith` / `auth` / `shipment` / `tracking` |
| `ADMIN_EMAIL` | Seed admin email | `admin@sayona.com` |
| `ADMIN_PASSWORD` | Seed admin password | *(set securely)* |
| `STAFF_EMAIL` | Seed staff email | `staff@sayona.com` |
| `STAFF_PASSWORD` | Seed staff password | *(set securely)* |

---

## Shipment Lifecycle

Status transitions enforced by `stateMachine.service.js`. Invalid transitions return `400`.

```
CREATED → PICKED_UP → IN_TRANSIT → ARRIVED_AT_WAREHOUSE → OUT_FOR_DELIVERY → DELIVERED
    ↓          ↓           ↓                  ↓                    ↓                 
RETURNED   RETURNED  FAILED_DELIVERY       IN_TRANSIT        FAILED_DELIVERY → OUT_FOR_DELIVERY
                          ↓                                          ↓
                     OUT_FOR_DELIVERY                             RETURNED
```

---

## Database Migrations

Applied in order by `scripts/migrate.js`. A `migration_log` table ensures each file runs exactly once.

| File | Description |
|---|---|
| `000_migration_tracking.sql` | Migration log table |
| `001_enterprise_schema.sql` | Core schema: users, shipments, tracking, packages, quotes, contacts, webhooks, audit |
| `002_token_security.sql` | Refresh token table + email verification tokens |
| `003_webhooks.sql` | Webhook endpoints + delivery log |
| `004_outbox_pattern.sql` | Outbox events table for reliable async dispatch |
| `005_multi_tenancy.sql` | Legacy tenant scaffolding (superseded by 006) |
| `006_saas_multi_tenancy.sql` | **NEW** — UUID tenants, RLS policies on all 13 tables, default tenant |
| `007_saas_billing_onboarding.sql` | **NEW** — Plans table, cached counters, DB-level limit triggers, manager/operator roles |

---

## Running Tests

```bash
cd backend
npm test
```

Test suite:

- `tests/health.test.js` — API health endpoint
- `tests/integration/auth.routes.test.js` — Auth flow integration tests
- `tests/unit/auth.service.test.js` — Auth service unit tests
- `tests/unit/config.test.js` — Environment config validation
- `tests/unit/pricing.service.test.js` — Weight + distance pricing logic
- `tests/unit/sanitize.test.js` — Input sanitization middleware
- `tests/unit/stateMachine.service.test.js` — State transition enforcement

```bash
npm run lint        # ESLint (zero warnings policy)
npm run lint:fix    # Auto-fix lint issues
```

---

## CI/CD Pipelines

Two workflows run in GitHub Actions:

**`ci.yml`** — runs on every push to `main`/`develop` and every PR to `main`:

```
install → lint (parallel) → test (parallel) → security audit → deploy gate
```

**`deploy-ec2.yml`** — runs on push to `main` only:

```
build frontend → validate build → whitelist runner IP → clean EC2 disk →
scp frontend/out → git pull + npm ci + migrate + seed + pm2 reload → 
set nginx permissions → revoke runner IP
```

---

## Microservice Mode

| `SERVICE_NAME` | Mounted routes |
|---|---|
| `monolith` *(default)* | All routes (including `/tenants`) |
| `auth` | `/api/v1/auth` only |
| `shipment` | `/api/v1/shipments` only |
| `tracking` | `/api/v1/tracking` only |

---

## Production Deployment Checklist

- [ ] `NODE_ENV=production` set in `.env`
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are 64+ random characters
- [ ] `ADMIN_PASSWORD` and `STAFF_PASSWORD` set to strong custom values
- [ ] `CORS_ORIGINS` set to your actual domain(s)
- [ ] HTTPS configured via Nginx with Let's Encrypt certificates
- [ ] Firewall: only ports 80 and 443 exposed; block 3000 and 5432
- [ ] PostgreSQL daily backups enabled
- [ ] Redis persistence configured (`appendonly yes`)
- [ ] `LOG_DIR` writable and on persistent storage
- [ ] Health check passing: `GET /api/v1/health` → `200`
- [ ] GitHub secrets set: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SECURITY_GROUP_ID`, `EC2_HOST`, `EC2_USER`, `EC2_KEY`
- [ ] PM2 ecosystem config (`ecosystem.config.js`) reviewed for production resource limits

---

## Project Structure (detailed)

```
backend/
├── server.js
├── worker.js
├── ecosystem.config.js                     ← NEW: PM2 process config
├── debug-env.js                            ← NEW: Env debug utility
├── nginx.conf                              ← NEW
├── nginx/
│   ├── nginx.conf                          ← NEW
│   └── sayonashipping.conf                 ← NEW
├── prometheus.yml                          ← NEW
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── database.js                     ← Updated: AsyncLocalStorage + RLS wrapper
│   │   ├── environment.js
│   │   ├── redis.js
│   │   ├── cors.js
│   │   ├── logger.js
│   │   ├── tracer.js
│   │   └── circuitBreaker.js
│   ├── controllers/
│   │   ├── tenant.controller.js            ← NEW
│   │   ├── auth.controller.js              ← Updated: registerCompany, inviteUser
│   │   └── [shipment, tracking, quote, contact, admin unchanged]
│   ├── services/
│   │   ├── auth.service.js                 ← Updated: registerCompany, inviteUser
│   │   └── [all other services unchanged]
│   ├── middlewares/
│   │   ├── billing.middleware.js            ← NEW: SaaS plan limit enforcement
│   │   ├── idempotency.middleware.js        ← NEW: Redis-backed (authoritative)
│   │   ├── tenantScope.js                  ← Multi-tenant request isolation
│   │   └── [authenticate, authorize, rateLimiter, audit, sanitize, etc. unchanged]
│   ├── routes/
│   │   └── v1/
│   │       ├── tenant.routes.js            ← NEW
│   │       ├── auth.routes.js              ← Updated: register-company, invite-user
│   │       └── [shipment, tracking, quotes, contacts, admin, docs, metrics unchanged]
│   ├── models/schemas.js                   ← Updated: manager, operator roles
│   ├── validators/
│   ├── repositories/
│   └── utils/
├── migrations/
│   ├── 000–005_[existing].sql
│   ├── 006_saas_multi_tenancy.sql          ← NEW
│   └── 007_saas_billing_onboarding.sql     ← NEW
└── tests/

frontend/
├── CLAUDE.md / AGENTS.md                   ← NEW: AI agent instructions
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx                  ← Updated: MobileCTABar
│   │   │   └── register-company/page.tsx   ← NEW
│   │   └── (admin)/admin/(protected)/
│   │       └── billing/page.tsx            ← NEW
│   ├── components/
│   │   ├── layout/
│   │   │   ├── mobile-cta-bar.tsx          ← NEW
│   │   │   └── whatsapp-button.tsx         ← NEW
│   │   └── admin/sidebar.tsx               ← Updated: Billing & Plan nav item
│   └── lib/utils/constants.ts              ← Updated: SITE.whatsapp

.github/workflows/
└── deploy-ec2.yml                          ← NEW: Production deploy to AWS EC2
postman/
├── collections/                            ← Restructured
└── globals/workspace.globals.yaml
robots.txt                                  ← NEW
sitemap.xml                                 ← NEW
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

**Sanuj S** — BTech CSE, Lovely Professional University

[![GitHub](https://img.shields.io/badge/GitHub-sanuj--s-181717?logo=github)](https://github.com/sanuj-s)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sanuj--s-0A66C2?logo=linkedin)](https://linkedin.com/in/sanuj-s-87a335303)
