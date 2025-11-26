FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/auth-service/package.json ./apps/auth-service/package.json
RUN pnpm install --filter @byob/auth-service... --prod=false

FROM deps AS build
COPY apps ./apps
RUN pnpm --filter @byob/auth-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/auth-service/dist ./dist
COPY apps/auth-service/package.json ./package.json
CMD ["node", "dist/main.js"]
