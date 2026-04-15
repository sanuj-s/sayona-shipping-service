# Sayona Shipping Service

> Enterprise logistics SaaS — real-time shipment tracking, quote management, and full admin operations. Built with Node.js, PostgreSQL, Redis, and a Next.js frontend.

[![CI/CD](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/ci.yml/badge.svg)](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-blue)](https://postgresql.org)

---

## Overview

Sayona Shipping Service is a full-stack logistics platform built to demonstrate enterprise-grade architecture. It covers the complete shipment lifecycle — from quote request to final delivery — with a public-facing marketing site, a client self-service portal, and a staff/admin management panel.

The backend implements patterns typical of production SaaS systems: repository pattern, domain state machines, distributed locking, idempotency, outbox pattern, event bus, multi-tenancy scaffolding, feature flags, and a full observability stack.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ + Express 5 |
| Database | PostgreSQL 15 (custom migration scripts) |
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
| CI/CD | GitHub Actions (lint → test → security → deploy gate) |

---

## Architecture

The project is a monorepo with two independently runnable layers:

```
sayona-shipping-service/
├── backend/                    ← Node.js REST API
│   └── src/
│       ├── routes/             ← Express route definitions (versioned: /api/v1)
│       │   └── v1/             ← auth, shipments, tracking, quotes, contacts, admin, docs, metrics
│       ├── controllers/        ← Request/response handling only
│       ├── services/           ← Business logic layer
│       ├── repositories/       ← All database queries (repository pattern)
│       ├── middlewares/        ← Auth, rate limiting, audit, idempotency, sanitize, timeout…
│       ├── validators/         ← Joi input schemas per domain
│       ├── models/schemas.js   ← Shared enums, role hierarchy, state transitions
│       ├── config/             ← DB, Redis, CORS, logger, tracer, circuit breaker
│       ├── utils/              ← AppError, pagination, responseHelper, uuid
│       └── workers/            ← outbox.worker.js (BullMQ background jobs)
├── frontend/                   ← Next.js 16 app
│   └── src/
│       ├── app/
│       │   ├── (public)/       ← Marketing site: home, services, tracking, contact, careers…
│       │   ├── (client)/       ← Client portal: login, register, dashboard, shipments, track
│       │   └── (admin)/        ← Staff panel: dashboard, shipments, quotes, contacts, users
│       ├── components/
│       │   ├── features/       ← Domain components (hero, tracking, quote form, timeline…)
│       │   ├── layout/         ← Navbar, footer, page header, command bar, scroll progress
│       │   ├── admin/          ← Admin sidebar, data table, stat card
│       │   └── ui/             ← Primitive UI components (button, input, card, modal…)
│       ├── lib/
│       │   ├── api/            ← API client + typed endpoints
│       │   ├── hooks/          ← Custom hooks (tracking, scroll animation, haptics…)
│       │   ├── store/          ← Zustand stores (auth, ui)
│       │   ├── types/          ← Shared TypeScript types
│       │   └── utils/          ← cn, constants, countries
│       └── providers/          ← Query, theme, toast, sensory, spatial-audio providers
├── migrations/                 ← (within backend/) 6 incremental SQL migration files
├── docker-compose.yml          ← Root-level compose (api + postgres + redis + worker)
└── scripts/
    └── build-static.cjs        ← Static export helper
```

**Key backend design decisions:**

- **Repository pattern** — all SQL lives in `repositories/`, never in services or controllers
- **State machine** — shipment status transitions are strictly enforced; invalid transitions return a `400` error
- **Distributed locking** — Redis-based mutex on status updates prevents race conditions in concurrent requests
- **Idempotency middleware** — duplicate POST requests are detected and short-circuited
- **Outbox pattern** — `004_outbox_pattern.sql` + `outbox.worker.js` ensure reliable async event dispatch
- **Event bus** — internal `eventBus.service.js` for decoupled domain events
- **Audit trail** — every state-changing action recorded with user ID, IP, user agent, and diffs
- **Multi-tenancy scaffolding** — `tenantScope` middleware + `005_multi_tenancy.sql` for future SaaS isolation
- **Feature flags** — `featureFlag.js` middleware for runtime feature toggling
- **Circuit breaker** — `opossum` wraps external service calls to prevent cascading failures
- **Microservice-ready routing** — `SERVICE_NAME` env var toggles which route groups are mounted (`auth`, `shipment`, `tracking`, or `monolith`)

---

## Features

**Security**
- JWT authentication with access/refresh token rotation (`002_token_security.sql`)
- Refresh token revocation on logout and password reset
- Brute-force protection with configurable account lockouts
- Role-Based Access Control (RBAC): `admin`, `staff`, `warehouse_staff`, `delivery_agent`, `client`
- Helmet, HPP, CORS, body size limits, and Content Security Policy in production
- Input sanitization via `sanitize-html` middleware
- Rate limiting: separate tiers for API, auth, form, and tracking endpoints
- API key middleware for machine-to-machine access

**Shipment Management**
- Full shipment lifecycle with enforced state machine transitions
- Multi-package weight aggregation and automatic pricing calculation
- Tracking events timeline with location and description at each stage
- Soft deletes and UUID-based public identification (no sequential IDs exposed)
- Version locking (optimistic concurrency) to detect stale updates

**Quote & Contact**
- Public quote submission with instant price estimate endpoint
- Staff quote review, reply-by-email, and status update workflow
- Contact form submissions with staff read/mark workflow
- Both protected by form-tier rate limiting + idempotency

**Operations**
- Admin dashboard with analytics: total shipments, revenue, delivery success rate
- Redis-cached analytics (5-minute TTL) to reduce DB load
- BullMQ outbox worker for reliable async jobs (notifications, webhooks)
- Webhook event dispatch on shipment creation and status changes (`003_webhooks.sql`)
- PDF shipping label generation with QR code
- Archive service for long-term shipment record management
- Route planning service (`route.service.js`)
- Elasticsearch-powered shipment search (`search.service.js`)

**Observability**
- Structured JSON logging via Winston with configurable log level and log directory
- OpenTelemetry distributed tracing exported to Jaeger
- Prometheus metrics endpoint (`/api/v1/metrics`)
- Access logging and audit logging as separate middleware layers
- Correlation IDs on every request

**Frontend (Next.js)**
- Public marketing site: home, services, industries, company, careers, privacy policy
- Real-time public tracking page
- Client portal: registration, login, forgot password, dashboard, shipments, profile
- Admin panel: dashboard with stats, shipment management, quote review, contact inbox, user management
- Framer Motion page transitions and scroll animations
- Magnetic cursor, luxury fluid canvas, spatial audio provider for enhanced UX
- Agentic command bar (`cmdk`) for power users
- Dark/light theme via `next-themes`

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v15+
- Redis
- Docker + Docker Compose *(optional — easiest way to run)*

---

### Option A — Docker (recommended)

```bash
git clone https://github.com/sanuj-s/sayona-shipping-service.git
cd sayona-shipping-service

# Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Start everything (Postgres + Redis + API + Worker)
docker-compose up -d
```

Migrations and seeding run automatically on startup via `npm run start:bootstrap`.  
API is available at `http://localhost:3000/api/v1`.

---

### Option B — Local Development

**1. Clone the repository**
```bash
git clone https://github.com/sanuj-s/sayona-shipping-service.git
cd sayona-shipping-service
```

**2. Set up the database**

Ensure PostgreSQL is running, then create the database:
```sql
CREATE DATABASE sayona_shipping;
```

**3. Configure environment**
```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials, JWT secrets, Redis URL, etc.
```

**4. Install and run the backend**
```bash
npm install
npm run setup    # Runs all migrations + seeds default admin/staff users
npm run dev      # Starts API with nodemon
```

API is available at `http://localhost:3000/api/v1`.

**5. Install and run the frontend**
```bash
cd ../frontend
npm install
npm run dev      # Starts Next.js dev server
```

Frontend is available at `http://localhost:3001` (or whichever port Next.js assigns).

**6. Run the background worker** *(optional — needed for async jobs)*
```bash
cd backend
npm run worker
```

---

## Environment Variables

All variables live in `backend/.env`. Copy from `backend/.env.example`.

| Variable | Description | Example |
|---|---|---|
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `BASE_URL` | Public-facing URL (used in logs, emails) | `http://localhost:3000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | DB username | `postgres` |
| `DB_PASSWORD` | DB password | `yourpassword` |
| `DB_NAME` | Database name | `sayona_shipping` |
| `DB_POOL_MAX` | Max pool connections | `20` |
| `JWT_SECRET` | Access token secret (64+ chars) | *(generate randomly)* |
| `JWT_REFRESH_SECRET` | Refresh token secret (64+ chars) | *(generate randomly)* |
| `JWT_ACCESS_EXPIRY` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token TTL | `7d` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:3001` |
| `RATE_LIMIT_MAX` | Max API requests per 15 min | `100` |
| `RATE_LIMIT_AUTH_MAX` | Max auth attempts per 15 min | `10` |
| `RATE_LIMIT_FORM_MAX` | Max form submissions per 15 min | `5` |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor | `12` |
| `MAX_LOGIN_ATTEMPTS` | Attempts before account lock | `5` |
| `LOCK_DURATION_MS` | Lock duration in ms | `1800000` *(30 min)* |
| `BODY_LIMIT` | Max request body size | `1mb` |
| `LOG_LEVEL` | Winston log level | `debug` / `info` |
| `LOG_DIR` | Log output directory | `./logs` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_URL` | Redis URL (alternative to host/port) | `redis://localhost:6379` |
| `EMAIL_USER` | SMTP username (Nodemailer) | `you@gmail.com` |
| `EMAIL_PASS` | SMTP password / app password | *(set securely)* |
| `SERVICE_NAME` | Microservice mode | `monolith` / `auth` / `shipment` / `tracking` |
| `ADMIN_EMAIL` | Seed admin email | `admin@sayona.com` |
| `ADMIN_PASSWORD` | Seed admin password | *(set securely)* |
| `STAFF_EMAIL` | Seed staff email | `staff@sayona.com` |
| `STAFF_PASSWORD` | Seed staff password | *(set securely)* |

---

## API Reference

Full Swagger UI: **`http://localhost:3000/api/v1/docs`**

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new user |
| `POST` | `/api/v1/auth/login` | Public | Login, returns JWT pair |
| `POST` | `/api/v1/auth/logout` | User | Revoke refresh token |
| `POST` | `/api/v1/auth/refresh` | Public | Get new access token |
| `POST` | `/api/v1/auth/forgot-password` | Public | Request password reset |
| `POST` | `/api/v1/auth/reset-password` | Public | Complete password reset |
| `GET` | `/api/v1/auth/verify-email/:token` | Public | Verify email address |
| `GET` | `/api/v1/auth/me` | User | Get current user |
| `PUT` | `/api/v1/auth/profile` | User | Update profile |

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
| `GET` | `/api/v1/health` | Public | Health check |
| `GET` | `/api/v1/metrics` | Public | Prometheus metrics |
| `GET` | `/api/v1/docs` | Public | Swagger UI |

---

## Shipment Lifecycle

Status transitions are enforced by a state machine. Invalid transitions return `400`.

```
CREATED → PICKED_UP → IN_TRANSIT → ARRIVED_AT_WAREHOUSE → OUT_FOR_DELIVERY → DELIVERED
    ↓          ↓           ↓                  ↓                                    
RETURNED   RETURNED  FAILED_DELIVERY      IN_TRANSIT               FAILED_DELIVERY → OUT_FOR_DELIVERY
                          ↓                                                       ↓
                     OUT_FOR_DELIVERY                                          RETURNED
```

---

## Database Migrations

Migrations are incremental SQL files applied in order by `scripts/migrate.js`. A `migration_log` table (created by `000_migration_tracking.sql`) ensures each file runs exactly once.

| File | Description |
|---|---|
| `000_migration_tracking.sql` | Migration log table |
| `001_enterprise_schema.sql` | Core schema: users, shipments, tracking, packages, quotes, contacts, webhooks, audit |
| `002_token_security.sql` | Refresh token table + email verification tokens |
| `003_webhooks.sql` | Webhook endpoints + delivery log |
| `004_outbox_pattern.sql` | Outbox events table for reliable async dispatch |
| `005_multi_tenancy.sql` | Tenant isolation scaffolding |

---

## Running Tests

```bash
cd backend
npm test
```

The test suite covers:

- `tests/health.test.js` — API health endpoint
- `tests/integration/auth.routes.test.js` — Auth flow integration tests
- `tests/unit/auth.service.test.js` — Auth service unit tests
- `tests/unit/config.test.js` — Environment config validation
- `tests/unit/pricing.service.test.js` — Weight + distance pricing logic
- `tests/unit/sanitize.test.js` — Input sanitization middleware
- `tests/unit/stateMachine.service.test.js` — State transition enforcement

Tests run with a live PostgreSQL instance (auto-provisioned in CI via GitHub Actions service containers).

```bash
npm run lint        # ESLint (zero warnings enforced)
npm run lint:fix    # Auto-fix lint issues
```

---

## CI/CD Pipeline

GitHub Actions runs on every push to `main` / `develop` and every PR to `main`:

```
install → lint (parallel) → test (parallel) → security audit → deploy gate
```

- **Lint**: ESLint with zero-warning policy
- **Test**: Jest with a live PostgreSQL 15 container
- **Security**: `npm audit --audit-level=high`
- **Deploy gate**: passes only when all three above succeed on `main`

---

## Microservice Mode

The backend supports splitting into independent services via the `SERVICE_NAME` environment variable. Only the relevant route groups are mounted per service:

| `SERVICE_NAME` | Mounted routes |
|---|---|
| `monolith` *(default)* | All routes |
| `auth` | `/api/v1/auth` only |
| `shipment` | `/api/v1/shipments` only |
| `tracking` | `/api/v1/tracking` only |

---

## Production Deployment Checklist

- [ ] `NODE_ENV=production` set in `.env`
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are 64+ random characters
- [ ] `ADMIN_PASSWORD` and `STAFF_PASSWORD` set to strong custom values
- [ ] `CORS_ORIGINS` set to your actual domain(s)
- [ ] HTTPS configured via Nginx (`backend/nginx/`) with Let's Encrypt certificates
- [ ] Firewall: only ports 80 and 443 exposed publicly; block 3000 and 5432
- [ ] PostgreSQL automated daily backups enabled
- [ ] Redis persistence configured (`appendonly yes`)
- [ ] `LOG_DIR` is writable and on persistent storage
- [ ] Health check passing: `GET /api/v1/health` returns `200`

---

## Project Structure (detailed)

```
backend/
├── server.js                       ← Entry point, graceful shutdown
├── worker.js                       ← BullMQ worker entry point
├── src/
│   ├── app.js                      ← Express app setup (no listen)
│   ├── config/
│   │   ├── environment.js          ← Joi-validated env vars
│   │   ├── database.js             ← PostgreSQL pool
│   │   ├── redis.js                ← Redis client
│   │   ├── cors.js                 ← CORS options
│   │   ├── logger.js               ← Winston logger
│   │   ├── tracer.js               ← OpenTelemetry setup
│   │   └── circuitBreaker.js       ← opossum factory
│   ├── controllers/                ← HTTP layer only
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── shipment.service.js
│   │   ├── tracking.service.js
│   │   ├── quote.service.js
│   │   ├── contact.service.js
│   │   ├── pricing.service.js      ← Weight + distance pricing
│   │   ├── stateMachine.service.js ← Transition enforcement
│   │   ├── lock.service.js         ← Redis distributed mutex
│   │   ├── cache.service.js
│   │   ├── webhook.service.js
│   │   ├── queue.service.js        ← BullMQ job enqueue
│   │   ├── notification.service.js
│   │   ├── email.service.js        ← Nodemailer integration
│   │   ├── label.service.js        ← PDF + QR label generation
│   │   ├── search.service.js       ← Elasticsearch integration
│   │   ├── route.service.js        ← Route planning
│   │   ├── storage.service.js
│   │   ├── archive.service.js
│   │   ├── audit.service.js
│   │   ├── token.service.js
│   │   └── eventBus.service.js     ← Internal event bus
│   ├── repositories/               ← All SQL queries
│   ├── middlewares/
│   │   ├── authenticate.js         ← JWT verification
│   │   ├── authorize.js            ← RBAC role check
│   │   ├── rateLimiter.js          ← 4 tiers (api/auth/form/tracking)
│   │   ├── auditLogger.js          ← Immutable action log
│   │   ├── idempotency.js          ← Duplicate request detection
│   │   ├── sanitize.js             ← Input sanitization
│   │   ├── timeout.js              ← Request timeout
│   │   ├── featureFlag.js          ← Runtime feature toggling
│   │   ├── tenantScope.js          ← Multi-tenancy isolation
│   │   ├── apiKey.middleware.js     ← API key auth for M2M
│   │   ├── accessLogger.js
│   │   ├── correlationId.js
│   │   ├── validate.js             ← Joi schema runner
│   │   └── errorHandler.js
│   ├── validators/                 ← Joi schemas per domain
│   ├── models/schemas.js           ← Enums, role hierarchy, transitions
│   ├── utils/
│   │   ├── AppError.js
│   │   ├── pagination.js
│   │   ├── responseHelper.js
│   │   └── uuid.js
│   └── workers/
│       └── outbox.worker.js        ← Outbox event processor
├── migrations/
│   ├── 000_migration_tracking.sql
│   ├── 001_enterprise_schema.sql
│   ├── 002_token_security.sql
│   ├── 003_webhooks.sql
│   ├── 004_outbox_pattern.sql
│   └── 005_multi_tenancy.sql
├── scripts/
│   ├── migrate.js
│   └── seed.js
└── tests/
    ├── health.test.js
    ├── setup.js
    ├── integration/
    │   └── auth.routes.test.js
    └── unit/
        ├── auth.service.test.js
        ├── config.test.js
        ├── pricing.service.test.js
        ├── sanitize.test.js
        └── stateMachine.service.test.js

frontend/
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── (public)/               ← Public marketing pages
│   │   ├── (client)/client/        ← Client portal (login, register, dashboard…)
│   │   └── (admin)/admin/          ← Admin panel (dashboard, shipments, quotes…)
│   ├── components/
│   │   ├── features/               ← Domain components
│   │   ├── layout/                 ← Navbar, footer, command bar
│   │   ├── admin/                  ← Admin-specific components
│   │   └── ui/                     ← Primitive UI components
│   ├── lib/
│   │   ├── api/                    ← Typed API client + endpoints
│   │   ├── hooks/                  ← Custom React hooks
│   │   ├── store/                  ← Zustand stores
│   │   ├── types/                  ← TypeScript types
│   │   └── utils/                  ← cn, constants, countries
│   └── providers/                  ← React context providers
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Author

**Sanuj S** — BTech CSE, Lovely Professional University

[![GitHub](https://img.shields.io/badge/GitHub-sanuj--s-181717?logo=github)](https://github.com/sanuj-s)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sanuj--s-0A66C2?logo=linkedin)](https://linkedin.com/in/sanuj-s-87a335303)
