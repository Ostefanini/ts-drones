FROM dhi.io/node:24-alpine3.22-dev AS builder
ENV CI=true
WORKDIR /workspace

# Enable pnpm
RUN corepack enable

# Copy config files
COPY .npmrc ./
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for all packages to leverage cache
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/api/package.json ./apps/api/package.json

# Install dependencies (frozen lockfile)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build shared package
RUN pnpm -C packages/shared build

# Generate Prisma Client
RUN pnpm -C apps/api exec prisma generate

# Build API
RUN pnpm -C apps/api build

# If you need prisma client inside dist (only if your runtime imports it from dist/)
RUN mkdir -p ./apps/api/dist/generated/prisma \
    && cp -r ./apps/api/src/generated/prisma/* ./apps/api/dist/generated/prisma/

# Produce a self-contained prod bundle
RUN pnpm --filter ./apps/api deploy /deploy --prod


# --- Migration Stage ---
FROM builder AS migrate
WORKDIR /workspace/apps/api
ENV NODE_ENV=production


# --- Runtime Stage ---
FROM dhi.io/node:24-alpine3.22 AS runtime
LABEL org.opencontainers.image.source="https://github.com/Ostefanini/ts-drones"
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /deploy ./

EXPOSE 4000

CMD ["node", "dist/index.js"]
