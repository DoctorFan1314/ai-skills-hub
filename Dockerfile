# ---- Build Stage ----
FROM node:20-alpine AS builder

# better-sqlite3 needs build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/src/lib/schema.sql ./src/lib/schema.sql

# Create data directory for SQLite
RUN mkdir -p data && chown -R nextjs:nodejs data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "\
  if [ -z \"$JWT_SECRET\" ]; then \
    if [ -f data/.jwt_secret ]; then \
      export JWT_SECRET=$(cat data/.jwt_secret); \
    else \
      JWT_SECRET=$(head -c 32 /dev/urandom | base64 | tr -d '/+=' | head -c 32); \
      export JWT_SECRET; \
      echo \"$JWT_SECRET\" > data/.jwt_secret; \
    fi; \
    echo 'JWT_SECRET auto-generated'; \
  fi; \
  if [ -z \"$ENCRYPTION_KEY\" ]; then \
    if [ -f data/.encryption_key ]; then \
      export ENCRYPTION_KEY=$(cat data/.encryption_key); \
    else \
      ENCRYPTION_KEY=$(head -c 32 /dev/urandom | base64 | tr -d '/+=' | head -c 32); \
      export ENCRYPTION_KEY; \
      echo \"$ENCRYPTION_KEY\" > data/.encryption_key; \
    fi; \
    echo 'ENCRYPTION_KEY auto-generated'; \
  fi; \
  exec node server.js"]
