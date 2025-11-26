FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/product-service/package.json ./apps/product-service/package.json
RUN pnpm install --filter @byob/product-service... --prod=false

FROM deps AS build
COPY apps ./apps
RUN pnpm --filter @byob/product-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/product-service/dist ./dist
COPY apps/product-service/package.json ./package.json
CMD ["node", "dist/main.js"]
