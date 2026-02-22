# Sayona Shipping Service

Enterprise-grade logistics SaaS platform providing seamless shipment tracking, quote generation, and administration capabilities.

## Architecture

The project is structured into three main components:
1. **Frontend / Public Site**: A responsive corporate website built with vanilla HTML/CSS/JS.
2. **Client/Admin Portals**: Frontend portals for clients to track shipments and staff/admins to manage logistics.
3. **Backend API**: A robust Node.js/Express platform using PostgreSQL with enterprise architecture (repositories, services, controllers) and strict security policies (JWT, RBAC, Rate Limiting).

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)
- Docker and Docker Compose (optional, for rapid deployment)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sayona-shipping-service
   ```

2. **Set up the Database:**
   Ensure PostgreSQL is running and create a database named `sayona_shipping`.

3. **Configure the Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Update .env with your database credentials
   ```

4. **Install Dependencies:**
   ```bash
   npm install
   ```

5. **Initialize Database Schema and Seed Data:**
   ```bash
   npm run setup
   ```

6. **Start the API Server:**
   ```bash
   npm run dev
   ```

7. **Launch the Frontend:**
   Open `index.html` in your browser or use a local dev server (e.g., Live Server, `npx serve .`).

## Key Features

- **Robust Security**: Role-Based Access Control (RBAC), JWT authentication with access/refresh pairs, brute-force protection, account lockouts.
- **Complete Audit Trail**: All state-changing actions are recorded with IP, user agent, and diffs.
- **Data Integrity**: Soft deletes, UUID identification, and version locking using PostgreSQL.
- **CI/CD Pipeline**: GitHub Actions configured for automated linting, testing, and security scanning on every commit.

## Production Deployment Checklist

Before going live, ensure the following sanity checks are met:

- [ ] **Production `.env` configured**: Ensure `NODE_ENV=production` and no default values remain.
- [ ] **Strong JWT Secrets**: `JWT_SECRET` and `JWT_REFRESH_SECRET` must be cryptographically secure (32+ random characters). The app will crash in production if they are shorter.
- [ ] **Production Database**: Created, secured, and migrated (`npm run setup` runs `migrate.js`).
- [ ] **Safe DB Seed**: The seed script will reject default passwords (`Admin@2026!Secure`) in production. You *must* supply `ADMIN_PASSWORD` and `STAFF_PASSWORD` in your `.env`.
- [ ] **CORS Configured**: Set `CORS_ORIGINS` to your actual production domain(s) in `.env` (e.g., `https://sayonashipping.com`).
- [ ] **HTTPS Enabled**: Configure your load balancer or Nginx (`nginx.conf`) with SSL/TLS certificates (e.g., Let's Encrypt).
- [ ] **Firewall**: Ensure your VPS only exposes ports 80 and 443 to the public internet. Block port 3000 and 5432.
- [ ] **Database Backups**: Enable automated daily backups for your PostgreSQL instance.
- [ ] **Log Rotation**: Logs are written to `/logs` using Winston. Ensure this directory is writable and persistent.
- [ ] **Health Check**: Verify the deployment by calling `GET /api/v1/health` (should return 200 `healthy`).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
