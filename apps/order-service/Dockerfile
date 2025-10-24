# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY ../../packages ./packages
COPY tsconfig.base.json ./
COPY apps/order-service/package.json ./apps/order-service/package.json
COPY apps/order-service/tsconfig.json ./apps/order-service/tsconfig.json
RUN npm ci --ignore-scripts

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app .
COPY apps/order-service ./apps/order-service
RUN npm run --workspace order-service build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/order-service/dist ./dist
COPY --from=build /app/apps/order-service/package.json ./package.json
RUN npm pkg delete scripts.dev && npm pkg delete scripts.build || true
RUN npm ci --omit=dev --ignore-scripts
ENV PORT=3004
EXPOSE 3004
CMD ["node", "dist/main.js"]
