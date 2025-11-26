FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY apps/manufacturer-portal/package.json ./apps/manufacturer-portal/package.json
RUN pnpm install --filter @byob/manufacturer-portal... --prod=false

FROM deps AS build
COPY apps ./apps
RUN pnpm --filter @byob/manufacturer-portal build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/manufacturer-portal/.next ./.next
COPY apps/manufacturer-portal/package.json ./package.json
COPY apps/manufacturer-portal/public ./public
CMD ["npx", "next", "start", "-p", "4001"]
