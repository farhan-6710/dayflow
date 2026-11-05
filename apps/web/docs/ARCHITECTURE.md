# Architecture — DayFlow

## System

```text
Web (Vite + React) ─┐
Mobile (Flutter) ───┴──► one Supabase project: Auth · Postgres · RLS
```

No sync service. **RLS is the access contract.** The database is read as-is; the rebuild never changes it.

## Stack

React 19 · TypeScript · Vite · React Router 7 · Tailwind 4 · shadcn/ui · lucide-react · framer-motion · phantom-ui · recharts · @dnd-kit · date-fns · sonner · next-themes · bun.

## Portals and routes

| Portal | Base | Guards | Layout |
|--------|------|--------|--------|
| Workspace | `/workspace` | `PublicRoute` for `/auth`, `ProtectedRoute` for the rest | `AppLayout` |
| Client portal | `/client-portal` | `ClientPublicRoute`, `ClientProtectedRoute` | `ClientAppLayout` |

Both layouts wrap one shared `AppShellLayout` (header, left sidebar, main content area with `<Outlet />`) and differ only by config: nav items, quick-action card, header actions. The route list is `apps/web/src/app/router.tsx`.

## Folder structure

```text
apps/web/src/
  main.tsx · index.css            entry, theme tokens (see DESIGN.md)
  app/                            App.tsx, router.tsx, lazyRoute.tsx, constants/ (route paths)
  features/
    workspace/<feature>/          auth, layouts, dashboard, tasks, projects, clients-management,
                                  client-activities, reminders, notifications, analytics, settings
    client/                       auth, layouts, pages, hooks, providers
  services/                       supabaseClient.ts, db.ts, one <domain>Service.ts each
  shared/                         ui/ (shadcn), components/, layouts/, providers/, hooks/,
                                  lib/, utils/, constants/, types/, unsaved-changes/,
                                  auth/, settings/, projects/, notifications/ (used by both portals)
shared/brand/brandManifest.json   repo root, brand copy for web + mobile
```

Feature folders contain: `components/ hooks/ pages/ constants/ types/ utils/` (only what is needed).

## Data flow

`page` → `hook` → `service` → Supabase. Pages compose; hooks hold state and logic; services hold every query.

## Data model and client portal security

Shared by web and mobile: see [DATABASE.md](../../../docs/DATABASE.md). The tables, the RPCs a client may call and the RLS contract live there.

## Shared module

`features/workspace/client-activities/` serves both portals. `activityRaisedBy="client"` saves new items as client-raised and limits editing to those.

## Services

`authService` · `oauthService` · `profilesService` · `projectsService` · `notesService` · `projectReferenceLinksService` · `noteReferenceLinksService` · `clientsService` · `clientPortalService` · `clientActivitiesService` · `clientChatMessagesService` · `tasksService` · `todosService` · `remindersService` · `notificationsService`

## Config

| Item | Where |
|------|-------|
| Env | `apps/web/.env` (untracked): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`; `VITE_APP_ORIGIN` optional (desktop OAuth bridge origin); `SEED_EMAIL`, `SEED_PASSWORD` for local seed scripts only. Mobile: see its own [ARCHITECTURE.md](../../mobile/docs/ARCHITECTURE.md). |
| Migrations | `scripts/migrations/` (001–037), append-only. The rebuild adds none. |
| Hosting | https://bisque-gull-237581.hostingersite.com (Hostinger). Desktop releases: https://github.com/farhan-6710/dayflow/releases |

### Auth redirect paths (keep identical)

These are on the Supabase Auth allow list. The app must serve the same paths, or the list must change in Supabase. `<origin>` is the hosting URL, or `http://localhost:5173` in development.

| Path / URL | Purpose |
|------------|---------|
| `<origin>/auth/oauth-callback` | Google OAuth popup callback (both portals), carries `?next=` |
| `<origin>/auth/desktop-oauth-bridge` | Desktop OAuth: the browser lands here, then forwards to the app |
| `dayflow://auth/callback` | Desktop deep link (Tauri scheme `dayflow`) |
| `<origin>/workspace/auth?form-type=reset-password` | Password-reset email link |
| `<origin>/workspace/dashboard` | Default redirect after email confirmation or sign-in |

Google is the only OAuth provider.

### Deploy

- `bun run build` in `apps/web` writes `dist/`. Upload only its contents, including `.htaccess`, to the Hostinger site root. Nothing outside `dist/` is deployed.
- `.htaccess` sends every route to `index.html`, so deep links and refreshes work on Apache.
- Env vars are baked in at build time, so build with `apps/web/.env` present.
- Keep the desktop bridge page live: released desktop builds use it.

### Desktop (Tauri)

Needs Rust (`rustup` recommended) and Xcode command line tools. From `apps/web`:

- `bun run tauri:dev` opens the app on the Vite dev server.
- `bun run tauri:build` builds the installer into `src-tauri/target/release/bundle/`. Install that build to test the `dayflow://` sign-in link.

The window, icons and bundle settings are in `src-tauri/tauri.conf.json`; allowed window and plugin actions are in `src-tauri/capabilities/default.json`.

### Recover from git

The old web app is at commit `b1335f3` under `apps/web/`. Restore a path with `git checkout b1335f3 -- <path>`. Useful for the desktop phase: `apps/web/src-tauri/` (identifier `com.dayflow.app`, version `0.1.9`, window 1280×840 min 960×600, deep-link scheme `dayflow`, CSP allowing `*.supabase.co`, plugins opener and deep-link) and the old `apps/web/src/services/`.
