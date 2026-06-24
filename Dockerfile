# syntax=docker/dockerfile:1

# ---- Build stage: compile TypeScript -> JavaScript ----
# Debian-based (glibc) image so the @temporalio/core-bridge native addon
# resolves a compatible prebuilt binary. Avoid Alpine (musl) here.
FROM node:18-slim AS builder
WORKDIR /app

# Install all dependencies (including devDeps like typescript) using the lockfile.
COPY package.json package-lock.json ./
RUN npm ci

# Compile src -> lib (see tsconfig.json outDir).
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage: production-only image ----
FROM node:18-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the compiled application from the build stage.
COPY --from=builder /app/lib ./lib

# Run as the unprivileged user that ships with the node image.
USER node

# Prometheus SDK metrics endpoint (see PROMETHEUS_BIND_ADDRESS).
EXPOSE 9464

# Connection settings are read from the environment; override at deploy time.
#   TEMPORAL_ADDRESS, TEMPORAL_NAMESPACE, TEMPORAL_TASK_QUEUE, PROMETHEUS_BIND_ADDRESS
CMD ["node", "lib/worker.js"]
