# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY ../../packages ./packages
COPY tsconfig.base.json ./
COPY apps/product-service/package.json ./apps/product-service/package.json
COPY apps/product-service/tsconfig.json ./apps/product-service/tsconfig.json
RUN npm ci --ignore-scripts

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app .
COPY apps/product-service ./apps/product-service
RUN npm run --workspace product-service build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/product-service/dist ./dist
COPY --from=build /app/apps/product-service/package.json ./package.json
RUN npm pkg delete scripts.dev && npm pkg delete scripts.build || true
RUN npm ci --omit=dev --ignore-scripts
ENV PORT=3002
EXPOSE 3002
CMD ["node", "dist/main.js"]
