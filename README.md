# Sayona Shipping Service

> A full-stack Logistics-as-a-Service platform — multi-tenant shipment tracking, quote management, subscription billing, and complete admin operations. Built with Node.js, PostgreSQL, Redis, and Next.js.

[![Deploy to EC2](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/deploy-ec2.yml/badge.svg)](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/deploy-ec2.yml)
[![CI](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/ci.yml/badge.svg)](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)](https://postgresql.org)

---

## Overview

Sayona Shipping Service is a production-grade logistics SaaS platform that covers the complete shipment lifecycle — from company onboarding and quote requests through to final delivery. It includes a public marketing site, a client self-service portal, and a staff and admin management panel.

The backend is built around patterns found in real production SaaS systems: repository pattern, domain state machines, distributed locking, idempotency, outbox pattern, event bus, PostgreSQL Row-Level Security for tenant isolation, subscription plan enforcement at both the application and database layer, and a full observability stack with distributed tracing, structured logging, and Prometheus metrics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ · Express 5 |
| Database | PostgreSQL 15 · custom migrations · Row-Level Security |
| Cache / Queue | Redis · BullMQ |
| Authentication | JWT (access + refresh tokens) · bcrypt |
| Validation | Joi |
| Observability | OpenTelemetry · Jaeger · Prometheus · Winston |
| Email | Nodemailer |
| PDF & Labels | PDFKit · QRCode |
| Search | Elasticsearch |
| Frontend | Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 |
| Frontend State | Zustand · TanStack React Query |
| Animations | Framer Motion |
| Infrastructure | Docker · Docker Compose · Nginx · PM2 |
| CI / CD | GitHub Actions · AWS EC2 |

---

## Features

### Multi-Tenant SaaS Architecture

Every core table (`users`, `shipments`, `tracking_events`, `quotes`, `contacts`, etc.) is scoped to a tenant via a `tenant_id UUID` column with a PostgreSQL Row-Level Security policy. Tenant context is propagated transparently through the request lifecycle using Node's `AsyncLocalStorage` — services and repositories call `query()` as normal and isolation is enforced at the database layer automatically.

A default tenant (`00000000-0000-0000-0000-000000000000`) covers single-tenant deployments and seeded data.

### Subscription Billing

Three built-in plans with hard limits enforced at both the middleware and database-trigger level, making them race-condition safe:

| Plan | Shipments | Users | Price |
|---|---|---|---|
| Free | 50 | 5 | $0 |
| Pro | 500 | 20 | $99 / mo |
| Enterprise | Unlimited | Unlimited | $499 / mo |

Cached counters (`shipment_count`, `user_count`) on the `tenants` table are maintained automatically by `AFTER INSERT / UPDATE / DELETE` triggers — no extra queries at the application layer. `BEFORE INSERT` triggers enforce limits at the DB level as a final safety net.

### Company Onboarding

`POST /api/v1/auth/register-company` creates a tenant and its initial admin user in a single atomic transaction and returns a JWT pair immediately. Workspace admins can then invite teammates via `POST /api/v1/auth/invite-user`.

### Shipment Lifecycle — State Machine

Status transitions are strictly enforced by `stateMachine.service.js`. Invalid transitions return `400`.

```
CREATED → PICKED_UP → IN_TRANSIT → ARRIVED_AT_WAREHOUSE → OUT_FOR_DELIVERY → DELIVERED
    ↓          ↓            ↓                 ↓                    ↓
RETURNED   RETURNED   FAILED_DELIVERY      IN_TRANSIT        FAILED_DELIVERY → OUT_FOR_DELIVERY
                           ↓                                         ↓
                      OUT_FOR_DELIVERY                           RETURNED
```

Every transition is recorded in `state_transitions`, dispatched to the outbox worker, and triggers webhook delivery and in-app notifications.

### Security

- JWT access + refresh token rotation with revocation on logout and password reset
- Refresh tokens hashed with SHA-256 before storage — raw token never persisted
- Brute-force protection with configurable account lockouts (`MAX_LOGIN_ATTEMPTS`, `LOCK_DURATION_MS`)
- Role-Based Access Control across seven roles (see Role Hierarchy below)
- Helmet, HPP, CORS, body size limits, and Content Security Policy with per-request nonces in production
- Input sanitization via `sanitize-html` on all request bodies
- Rate limiting with four independent tiers: API, auth, form submissions, and tracking
- API key middleware for machine-to-machine access
- Idempotency middleware (Redis-backed) — duplicate POST/PUT requests are detected and short-circuited

### Role Hierarchy

| Role | Privilege | Description |
|---|---|---|
| `admin` | Highest | Full platform access, billing, user management |
| `manager` | High | Team lead access |
| `operator` | Medium-high | Default role for invited users |
| `staff` | Medium | Internal staff operations |
| `warehouse_staff` | Low-medium | Warehouse operations |
| `delivery_agent` | Low | Delivery operations |
| `client` | Lowest | Self-service portal access |

### Operations

- Redis-cached analytics on the admin dashboard (5-minute TTL)
- BullMQ outbox worker for reliable async dispatch (notifications, webhooks)
- Webhook delivery with retry on shipment creation and status change
- PDF shipping label generation with embedded QR code
- Elasticsearch-powered shipment search
- Archive service for long-term record management
- Route planning service
- Soft deletes with UUID-based public identifiers (no sequential IDs exposed)
- Optimistic concurrency (version locking) on shipment updates
- Distributed Redis mutex on status updates to prevent race conditions

### Observability

- Structured JSON logging via Winston with configurable log level
- OpenTelemetry distributed tracing exported to Jaeger
- Prometheus metrics at `/api/v1/metrics`
- Access logging and immutable audit logging as independent middleware layers
- Correlation IDs on every request

### Frontend

- **Public marketing site** — home, services, industries, company, careers, privacy policy
- **Real-time tracking page** — public shipment lookup by tracking number
- **Client portal** — registration, login, forgot password, dashboard, shipments, profile
- **Admin panel** — dashboard with stats, shipment management, quote review, contact inbox, user management, billing & subscription
- **Register Company page** — SaaS onboarding flow, creates workspace and logs admin in immediately
- Floating WhatsApp contact button on all public pages
- Fixed mobile CTA bar ("Get a Free Quote") on all public pages
- Framer Motion page transitions and scroll animations
- Magnetic cursor, luxury fluid canvas, spatial audio provider
- Agentic command bar (`cmdk`) for power users
- Dark / light theme via `next-themes`

---

## Architecture

```
sayona-shipping-service/
├── backend/
│   ├── server.js                        Entry point, graceful shutdown
│   ├── worker.js                        BullMQ worker entry point
│   ├── ecosystem.config.js              PM2 process manager config
│   ├── nginx.conf
│   ├── nginx/
│   │   ├── nginx.conf
│   │   └── sayonashipping.conf
│   ├── prometheus.yml
│   └── src/
│       ├── app.js                       Express app setup (no listen)
│       ├── config/
│       │   ├── environment.js           Joi-validated env vars
│       │   ├── database.js              PostgreSQL pool + AsyncLocalStorage RLS wrapper
│       │   ├── redis.js
│       │   ├── cors.js
│       │   ├── logger.js                Winston
│       │   ├── tracer.js                OpenTelemetry
│       │   └── circuitBreaker.js        opossum factory
│       ├── routes/v1/
│       │   ├── auth.routes.js           /register-company, /invite-user, /login ...
│       │   ├── shipment.routes.js
│       │   ├── tracking.routes.js
│       │   ├── quote.routes.js
│       │   ├── contact.routes.js
│       │   ├── admin.routes.js
│       │   ├── tenant.routes.js         /usage, /upgrade-plan
│       │   ├── docs.routes.js
│       │   └── metrics.routes.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── shipment.controller.js
│       │   ├── tracking.controller.js
│       │   ├── quote.controller.js
│       │   ├── contact.controller.js
│       │   ├── admin.controller.js
│       │   └── tenant.controller.js
│       ├── services/
│       │   ├── auth.service.js          registerCompany (atomic txn), inviteUser, login ...
│       │   ├── shipment.service.js
│       │   ├── tracking.service.js
│       │   ├── quote.service.js
│       │   ├── contact.service.js
│       │   ├── pricing.service.js       Weight + distance pricing
│       │   ├── stateMachine.service.js  Transition enforcement + history
│       │   ├── lock.service.js          Redis distributed mutex
│       │   ├── cache.service.js
│       │   ├── webhook.service.js
│       │   ├── queue.service.js         BullMQ enqueue
│       │   ├── notification.service.js
│       │   ├── email.service.js         Nodemailer
│       │   ├── label.service.js         PDF + QR label
│       │   ├── search.service.js        Elasticsearch
│       │   ├── route.service.js
│       │   ├── archive.service.js
│       │   ├── audit.service.js
│       │   ├── token.service.js
│       │   └── eventBus.service.js      Internal event bus
│       ├── repositories/                All SQL — never in services or controllers
│       ├── middlewares/
│       │   ├── authenticate.js          JWT verification
│       │   ├── authorize.js             RBAC role check
│       │   ├── billing.middleware.js     Plan limit enforcement (SELECT FOR UPDATE)
│       │   ├── rateLimiter.js           4 tiers: api / auth / form / tracking
│       │   ├── auditLogger.js           Immutable action log
│       │   ├── idempotency.middleware.js Redis-backed duplicate detection
│       │   ├── sanitize.js
│       │   ├── tenantScope.js           AsyncLocalStorage tenant context injection
│       │   ├── featureFlag.js           Runtime feature toggling
│       │   ├── apiKey.middleware.js      M2M API key auth
│       │   ├── correlationId.js
│       │   ├── accessLogger.js
│       │   ├── timeout.js
│       │   └── errorHandler.js
│       ├── validators/                  Joi schemas per domain
│       ├── models/schemas.js            Enums, role hierarchy, state transitions
│       └── utils/                       AppError, pagination, responseHelper, uuid
│
├── migrations/
│   ├── 000_migration_tracking.sql
│   ├── 001_enterprise_schema.sql
│   ├── 002_token_security.sql
│   ├── 003_webhooks.sql
│   ├── 004_outbox_pattern.sql
│   ├── 005_multi_tenancy.sql
│   ├── 006_saas_multi_tenancy.sql       UUID tenants + RLS on all 13 tables
│   └── 007_saas_billing_onboarding.sql  Plans, cached counters, limit triggers
│
├── scripts/
│   ├── migrate.js
│   └── seed.js
│
└── tests/
    ├── health.test.js
    ├── setup.js
    ├── integration/auth.routes.test.js
    └── unit/
        ├── auth.service.test.js
        ├── config.test.js
        ├── pricing.service.test.js
        ├── sanitize.test.js
        └── stateMachine.service.test.js

frontend/
├── next.config.ts
├── nginx-sayona.conf
├── CLAUDE.md / AGENTS.md               AI coding agent instructions
└── src/
    ├── app/
    │   ├── (public)/
    │   │   ├── layout.tsx               Navbar + Footer + MobileCTABar
    │   │   ├── page.tsx                 Home
    │   │   ├── services/
    │   │   ├── industries/[slug]/
    │   │   ├── company/
    │   │   ├── careers/
    │   │   ├── contact/
    │   │   ├── tracking/
    │   │   ├── register-company/        SaaS workspace onboarding
    │   │   └── privacy-policy/
    │   ├── (client)/client/
    │   │   ├── login/ · register/ · forgot-password/
    │   │   └── (protected)/
    │   │       └── dashboard/ · shipments/ · track/ · profile/
    │   └── (admin)/admin/
    │       ├── login/
    │       └── (protected)/
    │           └── dashboard/ · shipments/ · quotes/ · contacts/ · users/ · billing/
    ├── components/
    │   ├── features/                    Domain components (hero, tracking, quote form, timeline ...)
    │   ├── layout/
    │   │   ├── navbar.tsx
    │   │   ├── footer.tsx
    │   │   ├── mobile-cta-bar.tsx       Fixed mobile "Get a Free Quote" bar
    │   │   ├── whatsapp-button.tsx      Floating WhatsApp contact button
    │   │   ├── agentic-command-bar.tsx
    │   │   ├── page-transition.tsx
    │   │   └── scroll-progress.tsx
    │   ├── admin/                       Sidebar, data table, stat card, admin header
    │   └── ui/                          Button, Input, Card, Modal, Badge, Select ...
    ├── lib/
    │   ├── api/                         Typed API client + endpoints
    │   ├── hooks/                       useTracking, useScrollAnimation, useHaptic ...
    │   ├── store/                       Zustand: auth-store, ui-store
    │   ├── types/
    │   └── utils/                       cn, constants (SITE.whatsapp), countries
    └── providers/                       Query, Theme, Toast, Sensory, SpatialAudio

.github/workflows/
├── ci.yml                               Lint → test → security → deploy gate
└── deploy-ec2.yml                       Production deploy to AWS EC2

postman/
├── collections/
└── globals/workspace.globals.yaml

robots.txt
sitemap.xml
```

---

## Database Migrations

Applied in order by `scripts/migrate.js`. A `migration_log` table ensures each file runs exactly once — idempotent by design.

| Migration | Description |
|---|---|
| `000_migration_tracking.sql` | Migration log table |
| `001_enterprise_schema.sql` | Core schema — users, shipments, packages, tracking, quotes, contacts, webhooks, audit |
| `002_token_security.sql` | Refresh tokens + email verification tokens |
| `003_webhooks.sql` | Webhook endpoints + delivery log |
| `004_outbox_pattern.sql` | Outbox events table for reliable async dispatch |
| `005_multi_tenancy.sql` | Initial tenant scaffolding |
| `006_saas_multi_tenancy.sql` | UUID-based tenants, `tenant_id` on all 13 tables, RLS policies |
| `007_saas_billing_onboarding.sql` | Plans table, cached counters, DB-level limit triggers, `manager` + `operator` roles |

### Row-Level Security

Every core table has an RLS policy:

```sql
CREATE POLICY tenant_isolation ON <table>
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
```

The `database.js` query wrapper injects `SET LOCAL app.current_tenant = '<uuid>'` before each isolated query using Node's `AsyncLocalStorage` — no changes required in services or repositories.

---

## API Reference

Full interactive docs: **`http://localhost:3000/api/v1/docs`**

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register-company` | Public | Create workspace + admin user (atomic) |
| `POST` | `/api/v1/auth/invite-user` | Admin | Invite a teammate to the workspace |
| `POST` | `/api/v1/auth/login` | Public | Login — returns access + refresh token |
| `POST` | `/api/v1/auth/logout` | User | Revoke refresh token |
| `POST` | `/api/v1/auth/refresh` | Public | Exchange refresh token for new access token |
| `POST` | `/api/v1/auth/forgot-password` | Public | Send password reset email |
| `POST` | `/api/v1/auth/reset-password` | Public | Complete password reset |
| `GET` | `/api/v1/auth/verify-email/:token` | Public | Verify email address |
| `GET` | `/api/v1/auth/me` | User | Get current user |
| `PUT` | `/api/v1/auth/profile` | User | Update profile |

### Tenants

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/tenants/usage` | User | Current usage vs plan limits |
| `POST` | `/api/v1/tenants/upgrade-plan` | Admin | Change subscription plan |

### Shipments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/shipments` | Staff+ | List shipments (paginated) |
| `POST` | `/api/v1/shipments` | Staff+ | Create shipment — idempotent |
| `GET` | `/api/v1/shipments/:uuid` | User | Get shipment by UUID |
| `PUT` | `/api/v1/shipments/:uuid` | Staff+ | Update shipment — idempotent |
| `DELETE` | `/api/v1/shipments/:uuid` | Admin | Soft-delete shipment |

### Tracking

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/tracking/:trackingNumber` | Public | Full tracking timeline |
| `POST` | `/api/v1/tracking` | Staff+ | Add a tracking event |

### Quotes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/quotes` | Public | Submit quote request — idempotent |
| `GET` | `/api/v1/quotes/estimate` | Public | Instant price estimate |
| `GET` | `/api/v1/quotes` | Staff+ | List all quotes |
| `PUT` | `/api/v1/quotes/:uuid/status` | Staff+ | Update quote status |
| `POST` | `/api/v1/quotes/:uuid/reply` | Staff+ | Reply via email |

### Contacts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/contacts` | Public | Submit contact form |
| `GET` | `/api/v1/admin/contacts` | Staff+ | View all submissions |
| `PUT` | `/api/v1/admin/contacts/:uuid/read` | Staff+ | Mark as read |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/admin/dashboard` | Admin | Analytics — shipments, revenue, delivery rate |
| `GET` | `/api/v1/admin/users` | Admin | List all users |
| `PUT` | `/api/v1/admin/users/:uuid` | Admin | Update user |
| `GET` | `/api/v1/admin/audit-logs` | Admin | Immutable audit log |

### System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | Public | Health check — DB connectivity, uptime |
| `GET` | `/api/v1/metrics` | Public | Prometheus metrics |
| `GET` | `/api/v1/docs` | Public | Swagger UI |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v15+
- Redis
- Docker + Docker Compose *(optional but recommended)*

### Option A — Docker

```bash
git clone https://github.com/sanuj-s/sayona-shipping-service.git
cd sayona-shipping-service

cp backend/.env.example backend/.env
# Fill in backend/.env

docker-compose up -d
```

All migrations and seeding run automatically. API available at `http://localhost:3000/api/v1`.

### Option B — Local Development

```bash
# 1. Clone
git clone https://github.com/sanuj-s/sayona-shipping-service.git
cd sayona-shipping-service

# 2. Create the database
psql -U postgres -c "CREATE DATABASE sayona_shipping;"

# 3. Configure environment
cd backend
cp .env.example .env
# Edit .env

# 4. Install and bootstrap
npm install
npm run setup       # runs all migrations + seeds admin/staff users
npm run dev         # API → http://localhost:3000

# 5. Frontend (separate terminal)
cd ../frontend
npm install
npm run dev         # Frontend → http://localhost:3001

# 6. Background worker (optional — needed for async jobs)
cd ../backend && npm run worker
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | API server port | `3000` |
| `NODE_ENV` | `development` · `staging` · `production` · `test` | `development` |
| `BASE_URL` | Public-facing URL | — |
| `DB_HOST` | PostgreSQL host | — |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | Database username | — |
| `DB_PASSWORD` | Database password | — |
| `DB_NAME` | Database name | — |
| `DB_POOL_MAX` | Max pool connections | `20` |
| `DB_IDLE_TIMEOUT` | Pool idle timeout (ms) | `30000` |
| `DB_CONN_TIMEOUT` | Connection timeout (ms) | `5000` |
| `JWT_SECRET` | Access token secret — 64+ chars | — |
| `JWT_REFRESH_SECRET` | Refresh token secret — 64+ chars | — |
| `JWT_ACCESS_EXPIRY` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token TTL | `7d` |
| `CORS_ORIGINS` | Allowed origins, comma-separated | `http://localhost:3000` |
| `RATE_LIMIT_MAX` | Max API requests per 15 min | `100` |
| `RATE_LIMIT_AUTH_MAX` | Max auth attempts per 15 min | `10` |
| `RATE_LIMIT_FORM_MAX` | Max form submissions per 15 min | `5` |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor (10–14) | `12` |
| `MAX_LOGIN_ATTEMPTS` | Attempts before account lock | `5` |
| `LOCK_DURATION_MS` | Account lock duration (ms) | `1800000` |
| `BODY_LIMIT` | Max request body size | `1mb` |
| `LOG_LEVEL` | `error` · `warn` · `info` · `debug` | `debug` |
| `LOG_DIR` | Log output directory | `./logs` |
| `REQUEST_TIMEOUT_MS` | Per-request timeout (ms) | `30000` |
| `REDIS_HOST` | Redis host | — |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_URL` | Redis URL (alternative to host/port) | — |
| `EMAIL_USER` | SMTP username | — |
| `EMAIL_PASS` | SMTP password / app password | — |
| `ENABLE_TRACING` | Enable OpenTelemetry | `false` |
| `JAEGER_ENDPOINT` | Jaeger collector URL | — |
| `SERVICE_NAME` | `monolith` · `auth` · `shipment` · `tracking` | `monolith` |
| `ADMIN_EMAIL` | Seed admin email | — |
| `ADMIN_PASSWORD` | Seed admin password | — |
| `STAFF_EMAIL` | Seed staff email | — |
| `STAFF_PASSWORD` | Seed staff password | — |

---

## Running Tests

```bash
cd backend
npm test
```

| Test | Coverage |
|---|---|
| `tests/health.test.js` | API health endpoint |
| `tests/integration/auth.routes.test.js` | Full auth flow |
| `tests/unit/auth.service.test.js` | Auth service logic |
| `tests/unit/config.test.js` | Env config validation |
| `tests/unit/pricing.service.test.js` | Weight + distance pricing |
| `tests/unit/sanitize.test.js` | Input sanitization |
| `tests/unit/stateMachine.service.test.js` | State transition enforcement |

```bash
npm run lint       # ESLint — zero warnings enforced
npm run lint:fix   # Auto-fix
```

---

## CI / CD

### `ci.yml` — every push and every PR to `main`

```
install → lint  ──┐
                  ├──→ security audit → deploy gate
install → test ──┘
```

### `deploy-ec2.yml` — push to `main` only

Deploys to AWS EC2 (`ap-south-1`):

1. Builds Next.js frontend to static export (`frontend/out/`)
2. Validates build output exists
3. Whitelists runner IP in EC2 security group for SSH
4. Cleans disk on the server (Docker prune, log rotation, Nginx reload)
5. SCPs `frontend/out/` to the server
6. On the server: `git pull` → `npm ci` → `npm run migrate` → `seed` → `pm2 reload`
7. Sets `ubuntu:www-data` ownership with `750` so Nginx can serve static files
8. Revokes runner IP from the security group (runs in `always()` — cleans up on failure too)

**Required secrets:** `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SECURITY_GROUP_ID`, `EC2_HOST`, `EC2_USER`, `EC2_KEY`

---

## Microservice Mode

The backend supports splitting into independent deployable services via `SERVICE_NAME`:

| `SERVICE_NAME` | Routes mounted |
|---|---|
| `monolith` *(default)* | All routes |
| `auth` | `/api/v1/auth` only |
| `shipment` | `/api/v1/shipments` only |
| `tracking` | `/api/v1/tracking` only |

---

## Production Checklist

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are 64+ random characters
- [ ] `ADMIN_PASSWORD` and `STAFF_PASSWORD` set to strong values
- [ ] `CORS_ORIGINS` restricted to your actual domain(s)
- [ ] HTTPS via Nginx + Let's Encrypt (`backend/nginx/`)
- [ ] Firewall: only ports 80 and 443 exposed — block 3000 and 5432
- [ ] PostgreSQL automated daily backups enabled
- [ ] Redis persistence enabled (`appendonly yes`)
- [ ] `LOG_DIR` writable and on persistent storage
- [ ] `GET /api/v1/health` returns `200`
- [ ] `ecosystem.config.js` reviewed for production resource limits
- [ ] GitHub Actions secrets configured for EC2 deploy

---

## License

[MIT](LICENSE)

---

## Author

**Sanuj S** — BTech CSE, Lovely Professional University

[![GitHub](https://img.shields.io/badge/GitHub-sanuj--s-181717?logo=github)](https://github.com/sanuj-s)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sanuj--s-0A66C2?logo=linkedin)](https://linkedin.com/in/sanuj-s-87a335303)
