FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/wallet-service/package.json ./apps/wallet-service/package.json
RUN pnpm install --filter @byob/wallet-service... --prod=false

FROM deps AS build
COPY apps ./apps
RUN pnpm --filter @byob/wallet-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/wallet-service/dist ./dist
COPY apps/wallet-service/package.json ./package.json
CMD ["node", "dist/main.js"]
