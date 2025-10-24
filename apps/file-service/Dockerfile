# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY tsconfig.base.json ./
COPY apps/file-service/package.json ./apps/file-service/package.json
COPY apps/file-service/tsconfig.json ./apps/file-service/tsconfig.json
RUN npm ci --ignore-scripts

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app .
COPY apps/file-service ./apps/file-service
RUN npm run --workspace file-service build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/file-service/dist ./dist
COPY --from=build /app/apps/file-service/package.json ./package.json
RUN npm pkg delete scripts.dev && npm pkg delete scripts.build || true
RUN npm ci --omit=dev --ignore-scripts
ENV PORT=3008
EXPOSE 3008
CMD ["node", "dist/main.js"]
