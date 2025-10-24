# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY ../../packages ./packages
COPY tsconfig.base.json ./
COPY apps/auth-service/package.json ./apps/auth-service/package.json
COPY apps/auth-service/tsconfig.json ./apps/auth-service/tsconfig.json
RUN npm ci --ignore-scripts

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app .
COPY apps/auth-service ./apps/auth-service
RUN npm run --workspace @byob/db prisma:generate || true
RUN npm run --workspace auth-service build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/auth-service/dist ./dist
COPY --from=build /app/apps/auth-service/package.json ./package.json
RUN npm pkg delete scripts.dev && npm pkg delete scripts.build || true
RUN npm ci --omit=dev --ignore-scripts
ENV PORT=3001
EXPOSE 3001
CMD ["node", "dist/main.js"]
