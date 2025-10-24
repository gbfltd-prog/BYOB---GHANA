# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY ../../packages ./packages
COPY tsconfig.base.json ./
COPY apps/chat-service/package.json ./apps/chat-service/package.json
COPY apps/chat-service/tsconfig.json ./apps/chat-service/tsconfig.json
RUN npm ci --ignore-scripts

FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app .
COPY apps/chat-service ./apps/chat-service
RUN npm run --workspace chat-service build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/chat-service/dist ./dist
COPY --from=build /app/apps/chat-service/package.json ./package.json
RUN npm pkg delete scripts.dev && npm pkg delete scripts.build || true
RUN npm ci --omit=dev --ignore-scripts
ENV PORT=3006
EXPOSE 3006
CMD ["node", "dist/main.js"]
