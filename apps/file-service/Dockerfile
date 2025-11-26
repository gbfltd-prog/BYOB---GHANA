FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/file-service/package.json ./apps/file-service/package.json
RUN pnpm install --filter @byob/file-service... --prod=false

FROM deps AS build
COPY apps ./apps
RUN pnpm --filter @byob/file-service build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/file-service/dist ./dist
COPY apps/file-service/package.json ./package.json
CMD ["node", "dist/main.js"]
