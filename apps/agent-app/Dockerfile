FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY pnpm-lock.yaml ./
COPY apps/agent-app/package.json ./apps/agent-app/package.json
RUN pnpm install --filter @byob/agent-app... --prod=false
COPY apps ./apps
EXPOSE 8081
CMD ["pnpm", "--filter", "@byob/agent-app", "start"]
