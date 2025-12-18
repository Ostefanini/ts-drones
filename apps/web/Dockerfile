FROM dhi.io/node:24-alpine3.22-dev AS builder
WORKDIR /workspace

COPY .npmrc ./
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN corepack enable
RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

RUN pnpm -C packages/shared build
RUN pnpm -C apps/web build

FROM dhi.io/nginx:1-alpine3.21 AS runtime
LABEL org.opencontainers.image.source=https://github.com/Ostefanini/ts-drones
WORKDIR /usr/share/nginx/html
COPY --from=builder /workspace/apps/web/dist ./
EXPOSE 80
CMD ["-g", "daemon off;"]
