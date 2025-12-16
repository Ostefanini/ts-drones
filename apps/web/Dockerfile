FROM node:24-alpine AS builder
WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN corepack enable && pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

WORKDIR /workspace/packages/shared
RUN pnpm build

WORKDIR /workspace/apps/web
RUN pnpm build


FROM nginx:alpine AS runtime
LABEL org.opencontainers.image.source=https://github.com/Ostefanini/ts-drones

WORKDIR /usr/share/nginx/html

COPY --from=builder /workspace/apps/web/dist .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
