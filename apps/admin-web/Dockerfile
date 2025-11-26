# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY apps/admin-web/package.json ./apps/admin-web/package.json
RUN pnpm install --filter @byob/admin-web... --prod=false

FROM deps AS build
COPY apps ./apps
RUN pnpm --filter @byob/admin-web build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/admin-web/.next ./.next
COPY apps/admin-web/package.json ./package.json
COPY apps/admin-web/public ./public
CMD ["npx", "next", "start", "-p", "4000"]
