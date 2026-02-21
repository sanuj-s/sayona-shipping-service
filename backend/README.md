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

## Architecture

```
backend/
├── config/
│   └── db.js                     # PostgreSQL pool configuration
├── models/                        # DATA LAYER — Database queries
│   ├── Admin.js                   # Admin CRUD operations
│   ├── Contact.js                 # Contact messages CRUD
│   ├── Quote.js                   # Quote requests CRUD
│   ├── Shipment.js                # Shipment CRUD + analytics
│   ├── Tracking.js                # Tracking events CRUD
│   └── User.js                    # User CRUD operations
├── services/                      # BUSINESS LOGIC LAYER
│   ├── authService.js             # Password hashing, JWT, login/register
│   ├── shipmentService.js         # Shipment lifecycle management
│   └── trackingService.js         # Tracking event management
├── controllers/                   # HTTP LAYER — Request/Response handlers
│   ├── adminAuthController.js     # Admin login, analytics, user mgmt
│   ├── authController.js          # User registration & login
│   ├── contactController.js       # Contact form submission
│   ├── quoteController.js         # Quote request submission
│   ├── shipmentController.js      # Shipment CRUD endpoints
│   └── trackingController.js      # Tracking history endpoints
├── middleware/                     # MIDDLEWARE LAYER
│   ├── adminMiddleware.js         # Admin JWT verification
│   ├── authMiddleware.js          # User JWT verification + role check
│   ├── errorHandler.js            # Global error handler + 404
│   └── rateLimiter.js             # Rate limiting (API, Auth, Forms)
├── routes/                        # ROUTING LAYER — URL mapping
│   ├── adminRoutes.js             # /api/admin/*
│   ├── authRoutes.js              # /api/auth/*
│   ├── contactRoutes.js           # /api/contact
│   ├── quoteRoutes.js             # /api/quote
│   ├── shipmentRoutes.js          # /api/shipments/*
│   └── trackingRoutes.js          # /api/tracking/*
├── .env.example                   # Environment variable template
├── init_db.js                     # Database schema initialization
├── seed_admin.js                  # Admin user seeder
├── server.js                      # Application entry point
└── package.json
```

### Request Flow

```
Client Request → Route → Middleware → Controller → Service → Model → PostgreSQL
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Initialize database tables
npm run init-db

# 4. Seed admin user
npm run seed-admin
# Default: admin@sayona.com / admin123

# 5. Start development server (with hot reload)
npm run dev

# OR start production server
npm start
```

Server starts at `http://localhost:3000`
Admin panel at `http://localhost:3000/admin/login.html`

## REST API Endpoints

### Health
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `GET` | `/api/health` | Public | Server health check |

### Authentication
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register user |
| `POST` | `/api/auth/login` | Public | Login user (rate-limited) |
| `GET` | `/api/auth/me` | Private | Get current user profile |

### Shipments
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/api/shipments` | Private | Create shipment |
| `GET` | `/api/shipments` | Public | List all shipments |
| `GET` | `/api/shipments/:tracking` | Public | Get shipment by tracking |
| `PUT` | `/api/shipments/:tracking` | Private | Update shipment status |
| `DELETE` | `/api/shipments/:tracking` | Admin | Delete shipment |

### Tracking
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `GET` | `/api/tracking/:tracking` | Public | Get tracking history |
| `POST` | `/api/tracking/update` | Private | Add tracking event |

### Contact & Quotes
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/api/contact` | Public | Submit contact form (rate-limited) |
| `POST` | `/api/quote` | Public | Submit quote request (rate-limited) |

### Admin Panel
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| `POST` | `/api/admin/login` | Public | Admin login (rate-limited) |
| `GET` | `/api/admin/profile` | Admin | Admin profile |
| `GET` | `/api/admin/analytics` | Admin | Dashboard statistics |
| `GET` | `/api/admin/shipments` | Admin | List all shipments |
| `POST` | `/api/admin/shipments` | Admin | Create shipment |
| `PUT` | `/api/admin/shipments/:tracking` | Admin | Update shipment |
| `DELETE` | `/api/admin/shipments/:tracking` | Admin | Delete shipment |
| `GET` | `/api/admin/tracking/:tracking` | Admin | Tracking history |
| `POST` | `/api/admin/tracking` | Admin | Add tracking event |
| `GET` | `/api/admin/users` | Admin | List all users |
| `GET` | `/api/admin/contacts` | Admin | List contact messages |
| `PUT` | `/api/admin/contacts/:id/read` | Admin | Mark message read |
| `GET` | `/api/admin/quotes` | Admin | List quote requests |
| `PUT` | `/api/admin/quotes/:id/status` | Admin | Update quote status |

## Database Schema

| Table | Purpose |
|-------|---------|
| `admins` | Admin panel users |
| `users` | Regular users/employees with phone, company, role |
| `shipments` | Shipment records with tracking IDs, auto-updated timestamps |
| `tracking` | Tracking event history (FK → shipments, CASCADE delete) |
| `contact_messages` | Contact form submissions with read status |
| `quote_requests` | Quote request submissions with status workflow |

## Security

- **Helmet** — HTTP security headers (XSS, clickjacking, MIME sniffing)
- **Rate Limiting** — 100 req/15min API, 10 req/15min auth, 5 req/15min forms
- **HPP** — HTTP Parameter Pollution protection
- **CORS** — Configurable origin whitelist
- **JWT** — Token-based auth with expiry (30d users, 7d admins)
- **bcrypt** — Password hashing with 10 salt rounds
- **Input validation** — All endpoints validate required fields
- **Graceful shutdown** — Proper SIGTERM/SIGINT handling
