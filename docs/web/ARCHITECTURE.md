# Architecture — DayFlow Web

Shared product and data: [PRD](../PRD.md) · [DATABASE](../DATABASE.md) · [RULES](../RULES.md).

## System

```text
Web (Vite + React) ─┐
Desktop (Tauri) ────┼──► one Supabase project: Auth · Postgres · RLS
Mobile (Flutter) ───┘
```

No sync service. **RLS is the access contract.** Apps do not change the database.

## Stack

React 19 · TypeScript · Vite · React Router 7 · Tailwind 4 · shadcn/ui · lucide-react · framer-motion · phantom-ui · recharts · @dnd-kit · date-fns · sonner · next-themes · embla-carousel (site) · Tauri 2 · bun.

## Portals

| Portal | Base | Guards | Layout |
|--------|------|--------|--------|
| Workspace | `/workspace` | `PublicRoute` / `ProtectedRoute` | `AppLayout` |
| Client portal | `/client-portal` | `ClientPublicRoute` / `ClientProtectedRoute` | `ClientAppLayout` |
| Website | `/`, `/features`, `/how-it-works`, `/about`, `/contact` | none | `SiteLayout` |

Both app layouts share `AppShellLayout` (header, sidebar, main). Routes: `src/app/router.tsx`.

## Folders

```text
apps/web/src/
  app/                 App, router, lazy routes, path constants
  features/workspace/  auth, layouts, dashboard, tasks, projects, clients-management,
                       client-activities, reminders, notifications, analytics, settings, assistant
  features/client/     client portal
  features/site/       public website
  services/            supabaseClient, db, one <domain>Service each
  shared/              ui, components, layouts, providers, hooks, auth, settings, …
apps/web/src-tauri/    desktop shell
shared/brand/          brandManifest.json, theme.json (repo root)
```

## Data flow

`page` → `hook` → `service` → Supabase. Queries live only in `services/`. Column names only in `services/db.ts`.

`features/workspace/client-activities/` is shared by both portals (`raised_by` / `forClientPortal`).

## Config

| Item | Where |
|------|-------|
| Env | `apps/web/.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`; optional `VITE_APP_ORIGIN` (desktop OAuth bridge); `SEED_*` / `EMAIL`+`PASSWORD` for local seeds only |
| Seeds | `bun run seed:present-month-tasks` — demo-account tasks for the current month (~85–90% done, rest missed / in progress). Optional `SEED_YEAR` / `SEED_MONTH`. |
| Assistant | `supabase/functions/assistant` — `GEMINI_API_KEY` in `supabase/functions/.env`; model fixed to `gemini-3.5-flash-lite` |
| Hosting | https://dayflow-web-version.vercel.app · Desktop: https://github.com/farhan-6710/dayflow/releases |
| Demo | `dayflow.demo@gmail.com` / `Dayflow@1234` |

### Auth redirect paths

On the Supabase Auth allow list. `<origin>` is the live site, or `http://localhost:5173` in dev.

| Path / URL | Purpose |
|------------|---------|
| `<origin>/auth/oauth-callback` | Google OAuth popup (`?next=`) |
| `<origin>/auth/desktop-oauth-bridge` | Browser → desktop handoff |
| `dayflow://auth/callback` | Desktop deep link |
| `<origin>/workspace/auth?form-type=reset-password` | Password reset |
| `<origin>/workspace/dashboard` | Default after sign-in |

Google is the only OAuth provider.

### Deploy (web)

Push to the connected git branch; Vercel rebuilds automatically. Live site: https://dayflow-web-version.vercel.app/

- Project root directory: `apps/web` (`vercel.json` sets Bun build, `dist` output and the SPA rewrite).
- Env on Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_APP_ORIGIN` (`https://dayflow-web-version.vercel.app`).
- Add that origin’s auth redirect paths to the Supabase allow list. Keep the desktop bridge page live for released desktop builds.

### Desktop (Tauri)

Needs Rust and Xcode CLT. From `apps/web`:

```bash
bun run tauri:dev
bun run tauri:build
```

Output: `src-tauri/target/release/bundle/`. Config: `src-tauri/tauri.conf.json`. Install notes: [README](../../README.md).

## Assistant (Flowy)

Floating control (⌘J) → `features/workspace/assistant/`. The name is `ASSISTANT_NAME` in `constants/assistantSuggestions.ts` and in `supabase/functions/assistant/assistantInstructions.ts`; change both together. Edge Function holds the key and tool declarations; the browser runs tools through normal services (RLS applies). Chat streams as NDJSON; session kept in `sessionStorage` per user.
