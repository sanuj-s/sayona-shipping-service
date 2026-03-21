# Sayona Shipping Service

> Enterprise logistics SaaS — real-time shipment tracking, quote management, and full admin operations. Built with Node.js, PostgreSQL, Redis, and a complete observability stack.

[![CI/CD](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/ci.yml/badge.svg)](https://github.com/sanuj-s/sayona-shipping-service/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-blue)](https://postgresql.org)

---

<!-- Add screenshots here after capturing them -->
<!-- ## Screenshots -->
<!-- ![Homepage](docs/screenshots/homepage.png) -->
<!-- ![Admin Dashboard](docs/screenshots/admin-dashboard.png) -->
<!-- ![Shipment Tracking](docs/screenshots/tracking.png) -->

---

## Overview

Sayona Shipping Service is a full-stack logistics platform built to demonstrate enterprise-grade backend architecture. It covers the complete shipment lifecycle — from quote request to final delivery — with a public-facing website, a client self-service portal, and a staff/admin management panel.

The backend implements patterns typically found in production SaaS systems: repository pattern, domain state machines, distributed locking, idempotency, event-driven webhooks, and a full observability stack.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 + Express 5 |
| Database | PostgreSQL 16 (custom migration scripts) |
| Cache / Queue | Redis + BullMQ |
| Authentication | JWT (access + refresh tokens) + bcrypt |
| Validation | Joi schema validation |
| Observability | OpenTelemetry + Jaeger + Prometheus + Pino |
| Email | Nodemailer |
| PDF / Labels | PDFKit + QRCode |
| Search | Elasticsearch |
| Infra | Docker, Nginx, PM2 |
| CI/CD | GitHub Actions (lint → test → security → deploy gate) |

---

## Architecture

The project is structured into three independently deployable layers:

```
sayona-shipping-service/
├── index.html              ← Public corporate website (HTML/CSS/JS)
├── client/                 ← Client self-service portal
├── admin/                  ← Staff and admin management panel
└── backend/                ← Node.js REST API
    └── src/
        ├── routes/         ← Express route definitions (versioned: /api/v1)
        ├── controllers/    ← Request/response handling only
        ├── services/       ← Business logic layer
        ├── repositories/   ← All database queries
        ├── middlewares/    ← Auth, rate limiting, audit, idempotency
        ├── validators/     ← Joi input schemas
        ├── models/         ← Shared enums and constants
        ├── config/         ← DB, Redis, CORS, logger, circuit breaker
        └── utils/          ← AppError, pagination, response helpers
```

**Key backend design decisions:**

- **Repository pattern** — all SQL lives in `repositories/`, never in services or controllers
- **State machine** — shipment status transitions are strictly enforced; invalid transitions throw a 400 error
- **Distributed locking** — Redis-based mutex on status updates prevents race conditions in concurrent requests
- **Idempotency middleware** — duplicate POST requests are detected and short-circuited
- **Audit trail** — every state-changing action is recorded with user ID, IP, user agent, and diffs
- **Circuit breaker** — `opossum` wraps external service calls to prevent cascading failures

---

## Features

**Security**
- JWT authentication with access/refresh token rotation
- Refresh token revocation on logout and password reset
- Brute-force protection with configurable account lockouts
- Role-Based Access Control (RBAC): `admin`, `staff`, `warehouse_staff`, `delivery_agent`, `client`
- Helmet, HPP, CORS, body size limits, and Content Security Policy in production
- Rate limiting: separate tiers for API, auth, form, and tracking endpoints

**Shipment Management**
- Full shipment lifecycle with enforced state machine transitions
- Multi-package weight aggregation and automatic pricing calculation
- Tracking events timeline with location and description at each stage
- Soft deletes and UUID-based public identification (no sequential IDs exposed)
- Version locking (optimistic concurrency) to detect stale updates

**Operations**
- Admin dashboard with analytics: total shipments, revenue, delivery success rate
- Redis-cached analytics (5-minute TTL) to reduce DB load
- BullMQ background worker for async jobs (notifications, webhooks)
- Webhook event dispatch on shipment creation and status changes
- PDF shipping label generation with QR code

**Observability**
- Structured JSON logging via Pino with correlation IDs on every request
- OpenTelemetry distributed tracing exported to Jaeger
- Prometheus metrics endpoint (`/api/v1/metrics`)
- Access logging and audit logging as separate middleware layers

**Developer Experience**
- Swagger/OpenAPI documentation at `/api/v1/docs`
- Postman collection included (`.postman/`)
- `npm run setup` — runs migrations + seeds in one command
- ESLint configured with zero-warning enforcement in CI
- Jest test suite with PostgreSQL service container in CI

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v14+
- Redis (for cache, locking, and queues)
- Docker + Docker Compose *(optional — easiest way to run)*

---

### Option A — Docker (recommended)

```bash
git clone https://github.com/sanuj-s/sayona-shipping-service.git
cd sayona-shipping-service

# Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Start everything (Postgres + Redis + API + Nginx)
docker-compose up -d

# Run migrations and seed
docker exec -it sayona-backend npm run setup
```

Visit `http://localhost` — the full stack is running.

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
# Edit .env with your DB credentials, JWT secrets, Redis URL etc.
```

**4. Install dependencies**
```bash
npm install
```

**5. Run migrations and seed**
```bash
npm run setup
```
This creates all tables and inserts a default admin and staff user.

**6. Start the API server**
```bash
npm run dev
```
API is available at `http://localhost:3000/api/v1`

**7. Open the frontend**

Open `index.html` directly in a browser, or use a local dev server:
```bash
npx serve .
```

**8. Build static output**
```bash
cd ..
npm run build
# Output: ./dist
```

---

## Environment Variables

All variables live in `backend/.env`. Copy from `backend/.env.example`.

| Variable | Description | Example |
|---|---|---|
| `PORT` | API server port | `3000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | DB username | `postgres` |
| `DB_PASSWORD` | DB password | `yourpassword` |
| `DB_NAME` | Database name | `sayona_shipping` |
| `JWT_SECRET` | Access token secret (64+ chars) | *(generate randomly)* |
| `JWT_REFRESH_SECRET` | Refresh token secret (64+ chars) | *(generate randomly)* |
| `JWT_ACCESS_EXPIRY` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token TTL | `7d` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `https://sayonashipping.me` |
| `RATE_LIMIT_MAX` | Max API requests per 15 min | `100` |
| `RATE_LIMIT_AUTH_MAX` | Max auth attempts per 15 min | `10` |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor | `12` |
| `MAX_LOGIN_ATTEMPTS` | Attempts before account lock | `5` |
| `LOCK_DURATION_MS` | Lock duration in ms | `1800000` *(30 min)* |
| `LOG_LEVEL` | Pino log level | `debug` / `info` |
| `ADMIN_EMAIL` | Seed admin email | `admin@sayona.com` |
| `ADMIN_PASSWORD` | Seed admin password *(required in prod)* | *(set securely)* |

---

## API Reference

Full Swagger UI: **`http://localhost:3000/api/v1/docs`**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Public | Register new user |
| `POST` | `/api/v1/auth/login` | Public | Login, returns JWT pair |
| `POST` | `/api/v1/auth/logout` | User | Revoke refresh token |
| `POST` | `/api/v1/auth/refresh` | Public | Get new access token |
| `GET` | `/api/v1/shipments` | Staff+ | List all shipments |
| `POST` | `/api/v1/shipments` | Staff+ | Create shipment |
| `GET` | `/api/v1/shipments/:uuid` | User | Get shipment by UUID |
| `PATCH` | `/api/v1/shipments/:uuid/status` | Staff+ | Update status |
| `GET` | `/api/v1/tracking/:trackingNumber` | Public | Get tracking timeline |
| `POST` | `/api/v1/quotes` | Public | Submit quote request |
| `GET` | `/api/v1/admin/analytics` | Admin | Dashboard analytics |
| `GET` | `/api/v1/health` | Public | Health check |

---

## Shipment Lifecycle

Status transitions are enforced by a state machine. Invalid transitions return `400`.

```
CREATED → PICKED_UP → IN_TRANSIT → ARRIVED_AT_WAREHOUSE → OUT_FOR_DELIVERY → DELIVERED
                                         ↕                                  ↓
                                    IN_TRANSIT                      FAILED_DELIVERY → RETURNED
```

---

## Running Tests

```bash
cd backend
npm test
```

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
- **Test**: Jest with a live PostgreSQL 16 container
- **Security**: `npm audit --audit-level=high`
- **Deploy gate**: passes only when all three above succeed on `main`

---

## Production Deployment Checklist

- [ ] `NODE_ENV=production` set in `.env`
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are 64+ random characters
- [ ] `ADMIN_PASSWORD` and `STAFF_PASSWORD` set to strong custom values (seed rejects defaults in prod)
- [ ] `CORS_ORIGINS` set to your actual domain(s)
- [ ] HTTPS configured via Nginx (`backend/nginx/`) with Let's Encrypt certificates
- [ ] Firewall: only ports 80 and 443 exposed publicly; block 3000 and 5432
- [ ] PostgreSQL automated daily backups enabled
- [ ] Redis persistence configured (`appendonly yes`)
- [ ] Log directory (`/logs`) is writable and on persistent storage
- [ ] Health check passing: `GET /api/v1/health` returns `200 healthy`

---

## Project Structure (detailed)

```
backend/
├── server.js                  ← Entry point, graceful shutdown
├── worker.js                  ← BullMQ background job worker
├── src/
│   ├── app.js                 ← Express app setup (no listen)
│   ├── config/
│   │   ├── environment.js     ← All env vars with validation
│   │   ├── database.js        ← PostgreSQL pool
│   │   ├── redis.js           ← Redis client
│   │   ├── cors.js            ← CORS options
│   │   ├── logger.js          ← Pino logger
│   │   ├── tracer.js          ← OpenTelemetry setup
│   │   └── circuitBreaker.js  ← opossum factory
│   ├── controllers/           ← HTTP layer only
│   ├── services/              ← Business logic
│   │   ├── shipment.service.js
│   │   ├── auth.service.js
│   │   ├── pricing.service.js ← Weight + distance pricing
│   │   ├── stateMachine.service.js
│   │   ├── lock.service.js    ← Redis distributed mutex
│   │   ├── cache.service.js
│   │   ├── webhook.service.js
│   │   ├── queue.service.js   ← BullMQ job enqueue
│   │   └── notification.service.js
│   ├── repositories/          ← All SQL queries
│   ├── middlewares/
│   │   ├── authenticate.js    ← JWT verification
│   │   ├── authorize.js       ← RBAC role check
│   │   ├── rateLimiter.js     ← 4 tiers (api/auth/form/tracking)
│   │   ├── auditLogger.js     ← Immutable action log
│   │   ├── idempotency.middleware.js
│   │   └── correlationId.js
│   ├── validators/            ← Joi schemas per domain
│   └── models/schemas.js      ← Enums, role hierarchy, transitions
├── migrations/
│   └── 001_enterprise_schema.sql
├── scripts/
│   ├── migrate.js
│   └── seed.js
└── tests/
    ├── health.test.js
    └── unit/pricing.service.test.js
```

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Author

**Sanuj S** — BTech CSE, Lovely Professional University

[![GitHub](https://img.shields.io/badge/GitHub-sanuj--s-181717?logo=github)](https://github.com/sanuj-s)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sanuj--s-0A66C2?logo=linkedin)](https://linkedin.com/in/sanuj-s-87a335303)
