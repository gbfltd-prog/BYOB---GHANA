# BYOB (Be Your Own Boss)

A production-ready digital ecosystem built for Klloyds Engineering Services Ghana Ltd. The platform empowers Ghanaian youth to earn income, prove employability, and access high-quality products from trusted manufacturers.

## Monorepo Layout

```
apps/
  auth-service/            # Agent onboarding, login, JWT issuance
  product-service/         # Catalog, commission rules, manufacturer onboarding
  order-service/           # Order orchestration, warehouse assignment
  warehouse-service/       # Warehouse + inventory management
  wallet-service/          # Wallets, transfers, payouts, approvals
  chat-service/            # Conversations + WebSocket messaging
  employability-service/   # AI-style scoring + certificate generation
  file-service/            # MinIO uploads & dynamic watermarks
  admin-web/               # Next.js admin dashboard
  manufacturer-portal/     # Next.js supplier portal
  agent-app/               # Expo/React Native app for agents
packages/
  prisma/                  # Prisma schema + Nest-ready PrismaService
  types/                   # Shared DTOs/interfaces
  nest-common/             # JWT guard/decorator helpers for all Nest apps
infra/
  docker/                  # Image templates (service-level Dockerfiles live in apps/*)
  k8s/                     # Kubernetes manifests + namespace config
  terraform/               # AWS VPC + EKS + RDS + Redis scaffolding
scripts/
  seed.ts                  # Seeds warehouses, sample agents, products, orders
```

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   pnpm prisma:generate
   ```
2. **Run Postgres/Redis/MinIO + services**
   ```bash
   docker compose up --build
   ```
   Environment defaults are already baked into `docker-compose.yml`.
3. **Apply seed data** (requires Postgres running)
   ```bash
   pnpm seed
   ```
4. **Develop locally**
   Each Nest service exposes `pnpm --filter @byob/<service> dev`. Next/Expo apps expose the usual `next dev` / `expo start` commands.

## API & Domain Highlights

- **Auth Service** – Registers Ghana Card–verified agents, issues JWTs, provisions wallets & agent profiles automatically.
- **Product Service** – Handles manufacturer onboarding, product CRUD, commission schemes, warehouse stock syncing, and share links + watermark metadata.
- **Order Service** – Builds orders, calculates totals/commissions, finds the nearest warehouse (haversine), debits inventory, and credits wallets upon delivery.
- **Warehouse Service** – Manages Ghana warehouse nodes and per-product inventory adjustments.
- **Wallet Service** – Tracks balances, transfers, MoMo payouts (with SuperAdmin > ₵1,000 approvals) and logs every transaction.
- **Chat Service** – Stores conversations/messages, exposes REST endpoints, and broadcasts WebSocket events for live chat + employability scoring hooks.
- **Employability Service** – Applies weighted competency logic, stores historical scores, and generates certificate URLs whenever agents score ≥ 4.0.
- **File Service** – Provisions MinIO buckets, handles uploads, and simulates on-the-fly watermark assets for social sharing.

All HTTP routes are protected with the shared JWT guard from `@byob/nest-common`, except for read-only leaderboard or health endpoints.

## Front-end Experiences

- **Admin Web** – Ops dashboard for orders, payouts, warehouse stock, and employability leaderboard (Next.js App Router + React Query).
- **Manufacturer Portal** – Fast lane for supplier registration and product uploads, wired to the product-service APIs.
- **Agent App** – Expo/React Native mobile client showing login, product feed, chat placeholder, wallet snapshot, and share-ready cards.

## Infrastructure

- **Docker Compose** – Spins up Postgres, Redis, MinIO, and every Nest service (`docker-compose.yml`).
- **Kubernetes** – `infra/k8s/byob-services.yaml` defines namespace, ConfigMaps, Secrets, and Deployments/Services for each microservice. `infra/k8s/minio.yaml` provisions a StatefulSet-backed MinIO cluster.
- **Terraform** – `infra/terraform` scaffolds AWS VPC networking, an EKS control plane with managed nodes, RDS Postgres, and ElastiCache Redis.
- **CI/CD Ready** – Container images are referenced as `ghcr.io/klloyds/byob-<service>:latest` placeholders. Swap with your registry + wire into GitHub Actions to complete the pipeline.

## Environment Variables

Each Nest service consumes:

- `DATABASE_URL` – Shared Postgres connection
- `JWT_SECRET` – Signing key (same across services)
- `SHARE_BASE_URL`, `CERT_BASE_URL`, etc. for contextual behavior
- `MINIO_*` for the file-service

Override via `.env` files or compose/Kubernetes manifests.

## Testing the Workflow

1. Register an agent via `auth-service` (`POST /api/auth/register-agent`).
2. Manufacturer uploads products through `manufacturer-portal` or the `product-service` API.
3. Agents fetch/share listings from `agent-app` or `product-service` feed.
4. Customers chat/order via `chat-service` and `order-service`.
5. Wallet credits trigger automatically; SuperAdmins approve large payouts in `wallet-service` or `admin-web`.
6. Chat events feed `employability-service`, issuing certificates for top performers.

## Next Steps

- Connect Ghana Card verification API in `auth-service`.
- Plug real AI/ML scoring or queue consumers into `employability-service`.
- Harden chat (media uploads, message receipts) and add push notifications for the agent app.
- Build GitHub Actions workflows to lint, test, build, push images, and roll out to Kubernetes automatically.

Welcome to BYOB – empower agents, respect data privacy, and ship quickly.
