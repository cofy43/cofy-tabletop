# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace config and lockfile first for layer caching
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/core-types/package.json ./packages/core-types/
COPY apps/backend/package.json ./apps/backend/

RUN pnpm install --frozen-lockfile --prod=false

# ============================================================
# Stage 2: Build
# ============================================================
FROM deps AS builder

# Copy source code
COPY packages/core-types/ ./packages/core-types/
COPY apps/backend/ ./apps/backend/

# Build shared types first, then the backend
RUN pnpm --filter @cofy-tabletop/core-types build && \
    pnpm --filter backend build

# Prune dev dependencies for production
RUN pnpm install --frozen-lockfile --prod

# ============================================================
# Stage 3: Production image
# ============================================================
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate

# Security: run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/pnpm-workspace.yaml /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/core-types/dist ./packages/core-types/dist
COPY --from=builder /app/packages/core-types/package.json ./packages/core-types/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules

USER appuser

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "apps/backend/dist/index.js"]
