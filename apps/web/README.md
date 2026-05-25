# Jobs Platform — Web (Nuxt 4)

Public job seeker frontend for the Australian MVP job listing platform.

## Setup

1. Copy environment file:

   ```bash
   cp apps/web/.env.example apps/web/.env
   ```

2. Ensure `NUXT_PUBLIC_API_BASE_URL` points at the NestJS API (default `http://localhost:4000`).

3. Install dependencies from the monorepo root:

   ```bash
   npm install
   ```

## Development

From the repo root:

```bash
npm run dev:api   # API on http://localhost:4000
npm run dev:web   # Nuxt on http://localhost:3000
```

Or from this package:

```bash
npm run dev
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with job search |
| `/jobs` | Job listings with search and filters |
| `/jobs/:slug` | Job detail page |

## Stack

- Nuxt 4 / Vue 3
- Nuxt UI + Tailwind CSS v4
- Fetches public data from NestJS (`GET /jobs`, `GET /jobs/:slug`, `GET /categories`)
