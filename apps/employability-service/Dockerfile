# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY ../../packages ./packages
COPY tsconfig.base.json ./
COPY apps/employability-service/package.json ./apps/employability-service/package.json
COPY apps/employability-service/tsconfig.json ./apps/employability-service/tsconfig.json
RUN npm ci --ignore-scripts

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app .
COPY apps/employability-service ./apps/employability-service
RUN npm run --workspace employability-service build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/employability-service/dist ./dist
COPY --from=build /app/apps/employability-service/package.json ./package.json
RUN npm pkg delete scripts.dev && npm pkg delete scripts.build || true
RUN npm ci --omit=dev --ignore-scripts
ENV PORT=3007
EXPOSE 3007
CMD ["node", "dist/main.js"]
