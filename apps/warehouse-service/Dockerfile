# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY ../../packages ./packages
COPY tsconfig.base.json ./
COPY apps/warehouse-service/package.json ./apps/warehouse-service/package.json
COPY apps/warehouse-service/tsconfig.json ./apps/warehouse-service/tsconfig.json
RUN npm ci --ignore-scripts

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app .
COPY apps/warehouse-service ./apps/warehouse-service
RUN npm run --workspace warehouse-service build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/warehouse-service/dist ./dist
COPY --from=build /app/apps/warehouse-service/package.json ./package.json
RUN npm pkg delete scripts.dev && npm pkg delete scripts.build || true
RUN npm ci --omit=dev --ignore-scripts
ENV PORT=3003
EXPOSE 3003
CMD ["node", "dist/main.js"]
