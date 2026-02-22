# ─────────────────────────────────────────────
# Dockerfile — Multi-stage build for Sayona Shipping API
# ─────────────────────────────────────────────
FROM node:20-alpine AS base

# Security: create non-root user
RUN addgroup -g 1001 -S sayona && \
    adduser -S sayona -u 1001

WORKDIR /app

# ── DEPENDENCIES ──
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# ── BUILD ──
FROM base AS runner

WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create logs directory
RUN mkdir -p logs && chown -R sayona:sayona /app

# Switch to non-root user
USER sayona

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]
