# Jobs Platform (MVP)

Australian job listing MVP for blue-collar, trades, VET, hospitality, cleaning, care, and practical local roles.

**Business model:** AUD $90 flat fee per job post. Admin approval before jobs go live.

## Monorepo structure

| Path | Purpose |
|------|---------|
| `apps/web` | Nuxt 4 frontend (not scaffolded yet) |
| `apps/api` | NestJS backend (not scaffolded yet) |
| `packages/shared` | Shared constants, types, schemas |
| `packages/api-client` | Shared API client (later) |
| `docs/` | Build playbook, DB design, API contract, flows |
| `.cursor/rules/project.md` | Cursor project rules |

## Architecture

```
Nuxt (web) → NestJS (api) → Prisma → Supabase Cloud PostgreSQL
```

Supabase provides PostgreSQL, Auth, and Storage. All business logic runs in NestJS.

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase Cloud project (`job-board-dev`) — see [docs/01-build-playbook.md](./docs/01-build-playbook.md)

## Environment

1. Copy `apps/api/.env.example` → `apps/api/.env` and fill in Supabase/DB/Stripe/email values.
2. Copy `apps/web/.env.example` → `apps/web/.env` and add public Supabase + API URL only.
3. See root `.env.example` for a variable reference.

**Never** commit `.env` files or put `SUPABASE_SERVICE_ROLE_KEY` in the web app.

## Scripts (after apps are scaffolded)

```bash
npm install
npm run dev:api   # NestJS on :4000
npm run dev:web   # Nuxt on :3000
```

Until `apps/api` and `apps/web` have `package.json` files, workspace dev scripts will not run.

## Documentation

- [01-build-playbook.md](./docs/01-build-playbook.md) — full build guide
- [02-database-design.md](./docs/02-database-design.md) — Prisma entities and rules
- [03-api-contract.md](./docs/03-api-contract.md) — REST API v1
- [04-user-flows.md](./docs/04-user-flows.md) — user journeys
- [05-release-checklist.md](./docs/05-release-checklist.md) — demo/release checks

## Next steps

1. Scaffold NestJS in `apps/api` (health check + Prisma wiring).
2. Scaffold Nuxt 4 in `apps/web`.
3. Build the first vertical slice: public jobs → apply → resume upload.
