# Sayona Shipping Service — Backend

Production-ready Node.js Express backend for the Sayona Shipping Service. Handles authentication, shipment management, tracking history, contact forms, quote requests, and an admin panel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Security | Helmet, CORS, Rate Limiting, HPP |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Initialize database
npm run init-db

# 4. Seed admin user
npm run seed-admin
# Default: admin@sayona.com / admin123

# 5. Start server
npm run dev
```

Server starts at `http://localhost:3000`
Admin panel at `http://localhost:3000/admin/login.html`

## API Endpoints

### Health
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/health` | Public | Server health check |

### Authentication
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |

### Shipments
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/shipments` | Private | Create shipment |
| GET | `/api/shipments` | Public | List all shipments |
| GET | `/api/shipments/:tracking` | Public | Get shipment by tracking |
| PUT | `/api/shipments/:tracking` | Private | Update shipment |
| DELETE | `/api/shipments/:tracking` | Admin | Delete shipment |

### Tracking
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/tracking/:tracking` | Public | Get tracking history |
| POST | `/api/tracking/update` | Private | Add tracking event |

### Contact
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/contact` | Public | Submit contact form |

### Quote
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/quote` | Public | Submit quote request |

### Admin Panel
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/admin/login` | Public | Admin login |
| GET | `/api/admin/profile` | Admin | Admin profile |
| GET | `/api/admin/analytics` | Admin | Dashboard stats |
| GET | `/api/admin/shipments` | Admin | List shipments |
| POST | `/api/admin/shipments` | Admin | Create shipment |
| PUT | `/api/admin/shipments/:tracking` | Admin | Update shipment |
| DELETE | `/api/admin/shipments/:tracking` | Admin | Delete shipment |
| GET | `/api/admin/tracking/:tracking` | Admin | Tracking history |
| POST | `/api/admin/tracking` | Admin | Add tracking event |
| GET | `/api/admin/users` | Admin | List users |
| GET | `/api/admin/contacts` | Admin | List contact messages |
| PUT | `/api/admin/contacts/:id/read` | Admin | Mark message read |
| GET | `/api/admin/quotes` | Admin | List quote requests |
| PUT | `/api/admin/quotes/:id/status` | Admin | Update quote status |

## Database Tables

- `admins` — Admin panel users
- `users` — Regular users / employees
- `shipments` — Shipment records with tracking IDs
- `tracking` — Tracking event history
- `contact_messages` — Contact form submissions
- `quote_requests` — Quote request submissions

## Security Features

- **Helmet** — Security headers (XSS, clickjacking, MIME sniffing)
- **Rate Limiting** — 100 req/15min API, 10 req/15min auth, 5 req/15min forms
- **HPP** — HTTP Parameter Pollution protection
- **CORS** — Configurable origin whitelist
- **JWT** — Token-based authentication with expiry
- **bcrypt** — Password hashing with salt
- **Input validation** — All endpoints validate required fields

## Project Structure

```
backend/
├── config/
│   └── db.js              # PostgreSQL pool config
├── controllers/
│   ├── adminAuthController.js
│   ├── authController.js
│   ├── contactController.js
│   ├── quoteController.js
│   ├── shipmentController.js
│   └── trackingController.js
├── middleware/
│   ├── adminMiddleware.js
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── rateLimiter.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── contactRoutes.js
│   ├── quoteRoutes.js
│   ├── shipmentRoutes.js
│   └── trackingRoutes.js
├── .env.example
├── init_db.js
├── seed_admin.js
├── server.js
└── package.json
```
