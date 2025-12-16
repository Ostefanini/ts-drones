FROM node:24-alpine AS builder

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/api/package.json ./apps/api/package.json

RUN corepack enable && \
    pnpm install

COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

WORKDIR /workspace/packages/shared
RUN pnpm build

WORKDIR /workspace/apps/api
RUN pnpm build

FROM node:24-alpine

WORKDIR /workspace

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/api/package.json ./apps/api/package.json

RUN corepack enable && \
    pnpm install --prod

COPY --from=builder /workspace/packages/shared/dist ./packages/shared/dist
COPY --from=builder /workspace/apps/api/dist ./apps/api/dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /workspace

USER nodejs

WORKDIR /workspace/apps/api

EXPOSE 4000

CMD ["node", "dist/index.js"]
