# Architecture — DayFlow (web)

Vite SPA plus the Tauri desktop shell. Both talk straight to Supabase; the only server code is the `assistant` Edge Function.

Shared product and data: [PRD](../PRD.md) · [DATABASE](../DATABASE.md) · [RULES](../RULES.md).

## System

```text
Web (Vite + React) ─┐
Desktop (Tauri) ────┼──► one Supabase project: Auth · Postgres · RLS
Mobile (Flutter) ───┘
```

No sync service. **RLS is the access contract.** Apps do not change the database.

## Stack

Majors from `apps/web/package.json`:

| Area | Choice |
|------|--------|
| Build / language | Vite 8, TypeScript 6, ESLint 10, Bun |
| UI | React 19, React Router 7, Tailwind CSS 4 (`@tailwindcss/vite`), shadcn/ui on `radix-ui` 1, `class-variance-authority`, `tw-animate-css` |
| Fonts | `@fontsource/ovo`, `young-serif`, `merriweather` |
| Motion | framer-motion 14, `@aejkatappaja/phantom-ui` (loading skeletons), Embla carousel 8 (site) |
| Data and widgets | `@supabase/supabase-js` 2, recharts 3, `@dnd-kit` (core 6, sortable 10), date-fns 4, `react-day-picker` 10, sonner 2, next-themes 0.4, lucide-react |
| Desktop | Tauri 2.11 (`@tauri-apps/api`, deep-link and opener plugins) |

Web version `0.2.0`; desktop version `0.1.17` (`src-tauri/tauri.conf.json`).

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
brandManifest.json     brand copy (repo root, single source)
shared/brand/          theme.json + generated theme.css / theme.ts (repo root)
```

## Data flow

`page` → `hook` → `service` → Supabase. Queries live only in `services/`. Column names only in `services/db.ts`.

`features/workspace/client-activities/` is shared by both portals (`raised_by` / `forClientPortal`).

## State

No global store. Server data is fetched in hooks and kept in component state. Cross-cutting state lives in providers (`shared/providers`, feature `providers/`): theme (`next-themes`, key `DF-theme`), user settings (`user_settings` table), auth session, unsaved-changes guard. The assistant chat is kept in `sessionStorage` per user.

## Config

| Item | Where |
|------|-------|
| Env | `apps/web/.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`; optional `VITE_APP_ORIGIN` (desktop OAuth bridge). Seed scripts only: `SEED_EMAIL` (or `EMAIL`), `SEED_PASSWORD` (or `PASSWORD`), optional `SEED_YEAR`, `SEED_MONTH`. Edge Function: `GEMINI_API_KEY` (own secret); `SUPABASE_URL`, `SUPABASE_ANON_KEY` come from Supabase |
| Seeds | `bun run seed:present-month-tasks` and `seed:nov-tasks` — demo-account tasks for the current (or November) month, ~85–90% done, rest missed / in progress. Optional `SEED_YEAR` / `SEED_MONTH`. |
| Assistant | `supabase/functions/assistant` — `GEMINI_API_KEY` in `supabase/functions/.env`; model fixed to `gemini-3.5-flash-lite` |
| Hosting | https://dayflow-web-version.vercel.app · Desktop: https://github.com/farhan-6710/dayflow/releases |
| Demo account | Shared public account; credentials live in `src/shared/auth/constants/demoAccount.ts` and show on the login screen |
| Brand | `src/shared/brand/brandManifest.ts` imports `brandManifest.json` from the repo root; `vite.config.ts` fills every `%BRAND_*%` placeholder in `index.html` (title, meta, Open Graph, icons, JSON-LD) |
| SEO / sharing | See the table below |

### SEO and sharing

Static `index.html` only (WhatsApp and most crawlers do not run JS). Copy and URLs come from `brandManifest.json` (`siteUrl`, `seo.*`, `logo.*`). `siteUrl` is the Vercel URL above (also the desktop OAuth bridge origin when `VITE_APP_ORIGIN` is unset, via `BRAND_SITE_URL`); change it when a custom domain goes live, and update the same URL in `public/robots.txt` and `public/sitemap.xml`.

| Piece | Where |
|-------|-------|
| Title, description, canonical, theme-color | `index.html`, filled from `seo` |
| Open Graph + Twitter `summary_large_image` | `index.html`; image is an absolute URL built from `siteUrl` + `seo.image.url` |
| JSON-LD (`WebApplication`) | built in `vite.config.ts`, injected at `%BRAND_JSON_LD%` |
| Share card | `public/share-card.jpg`, 1200×630, from `scripts/share-card/card.html` |
| Icons | `public/favicon-{light,dark}.png` (media-query links), `apple-touch-icon.png`, `favicon*.ico` |
| Crawlers | `public/robots.txt` (private areas disallowed), `public/sitemap.xml` (public site pages) |

Regenerate the share card and PNG icons: `bun run share-card` (needs Google Chrome and Pillow; fonts come from `node_modules`). The `.ico` favicons come from `scripts/brand_icon.py` as before.

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
