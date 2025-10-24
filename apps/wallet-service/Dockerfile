# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY ../../packages ./packages
COPY tsconfig.base.json ./
COPY apps/wallet-service/package.json ./apps/wallet-service/package.json
COPY apps/wallet-service/tsconfig.json ./apps/wallet-service/tsconfig.json
RUN npm ci --ignore-scripts

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app .
COPY apps/wallet-service ./apps/wallet-service
RUN npm run --workspace wallet-service build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/wallet-service/dist ./dist
COPY --from=build /app/apps/wallet-service/package.json ./package.json
RUN npm pkg delete scripts.dev && npm pkg delete scripts.build || true
RUN npm ci --omit=dev --ignore-scripts
ENV PORT=3005
EXPOSE 3005
CMD ["node", "dist/main.js"]
