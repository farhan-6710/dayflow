# Architecture — DayFlow

## System

```text
Web (Vite + React) ─┐
Mobile (Expo) ──────┴──► one Supabase project: Auth · Postgres · RLS
```

No sync service. **RLS is the access contract.** The database is read as-is; the rebuild never changes it.

## Stack

React 19 · TypeScript · Vite · React Router 7 · Tailwind 4 · shadcn/ui · lucide-react · framer-motion · phantom-ui · recharts · @dnd-kit · date-fns · sonner · next-themes · bun.

## Portals and routes

| Portal | Base | Guards | Layout |
|--------|------|--------|--------|
| Workspace | `/workspace` | `PublicRoute` for `/auth`, `ProtectedRoute` for the rest | `AppLayout` |
| Client portal | `/client-portal` | `ClientPublicRoute`, `ClientProtectedRoute` | `ClientAppLayout` |

Both layouts wrap one shared `AppShellLayout` (header, left sidebar, main content area with `<Outlet />`) and differ only by config: nav items, quick-action card, header actions. Full route list: [WEB_REBUILD_SPEC.md](./WEB_REBUILD_SPEC.md).

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
| Env | `apps/web/.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` |
| Auth redirects | Fixed paths, see [WEB_ENV_AND_LINKS.md](./WEB_ENV_AND_LINKS.md) |
| Migrations | `scripts/migrations/` (001–037), append-only. The rebuild adds none. |
