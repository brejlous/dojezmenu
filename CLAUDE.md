# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                        # Dev server at localhost:3000
npm run dev -- --hostname 0.0.0.0  # Accessible on local network (mobile testing)
npm run build                      # Production build
npm run lint                       # ESLint
```

No test suite exists yet. For local dev, copy `.env.local.example` to `.env.local` and fill in Supabase credentials.

## Architecture

**LastBite by Piano** — Czech food-rescue app. Restaurants post leftover daily-menu portions at a discount; customers reserve and pick up.

**Stack:** Next.js 16 App Router, Supabase (PostgreSQL + Auth), Tailwind CSS v4, deployed on Vercel.

### Data flow

- `lib/data.ts` — TypeScript types (`Nabidka`, `Restaurace`, `Rezervace`), pure utility functions (`formatCena`, `getSlevaPercent`, `kategorieLabels`). No data arrays — those moved to Supabase.
- `lib/db.ts` — all Supabase queries. Returns the same camelCase types from `lib/data.ts` via mappers (DB uses snake_case columns).
- `lib/supabase/server.ts` — server-side Supabase client (uses cookies, for Server Components + Server Actions).
- `lib/supabase/client.ts` — browser Supabase client (for `'use client'` components).
- `lib/supabase/admin.ts` — service role client, bypasses RLS (admin operations only).
- `app/actions/` — Server Actions: `auth.ts` (login/logout/getUser), `nabidky.ts` (createNabidka, deactivateNabidka, updateStavRezervace), `rezervace.ts` (createRezervace, updateRestauraceProfil).

### Auth

Supabase Auth with email/password. Middleware (`middleware.ts`) protects `/restaurace/*` (except `/restaurace/login`) and `/admin/*` — redirects unauthenticated users to `/restaurace/login`.

Admin role: `profiles` table, `role = 'admin'`. Regular restaurant owners have `role = 'restaurant'`. Admin layout additionally checks role and redirects non-admins.

### Database schema

`supabase/schema.sql` — run once in Supabase SQL Editor. Key behaviors:
- `decrement_zbyvajici_kusu` trigger atomically decrements available portions on reservation insert; raises exception if insufficient stock.
- `handle_new_user` trigger auto-creates a `profiles` row on signup.
- RLS: public can read active `nabidky` and all `restaurace`; restaurant owners can CRUD their own `nabidky`/`rezervace`; anyone can insert `rezervace`.

### Routing

| Route | Description |
|-------|-------------|
| `/` | Customer homepage — offer list with category filters |
| `/nabidka/[id]` | Offer detail (server component, fetches from DB) |
| `/rezervace/[id]` | Reservation form — server wrapper prefetches, `RezervaceClient` handles UI |
| `/rezervace/[id]/potvrzeni` | Confirmation — reads data from URL search params (`PotvrzeniClient`) |
| `/restaurace/login` | Restaurant login |
| `/restaurace/dashboard` | Restaurant dashboard (auth required) |
| `/restaurace/nova-nabidka` | Create offer (auth required) |
| `/restaurace/nastaveni` | Profile settings — server wrapper + `NastaveniClient` |
| `/admin` | Admin overview (role=admin required) |

### Styling

Tailwind CSS v4 — `@import "tailwindcss"` and `@theme` in `globals.css`. Brand tokens:

| Token | Value | Use |
|-------|-------|-----|
| `brand` | `#94002A` | Primary (Piano crimson) |
| `brand-hover` | `#7a0022` | Hover state |
| `brand-light` | `#FEF4E8` | Backgrounds, highlights |
| `brand-muted` | `#e8c5c5` | Focus rings, borders |

### Deployment

Vercel — connect GitHub repo, add env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`). CI runs TypeScript check on every push via `.github/workflows/deploy.yml`.
