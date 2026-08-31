# Agent Guidelines — DayFlow

Coding rules and conventions for developers and AI agents working on DayFlow.

---

## Core Philosophy

- **Simplicity over everything** — smallest change that solves the problem; no extra layers
- **Two portals, one codebase** — workspace (`features/workspace/`, routes under `/workspace`) and client (`features/client/`); share via `shared/` and selective reuse (e.g. `client-activities`)
- **Beginner-friendly code** — flat functions, clear names, one job per function
- **Strict domain separation** — feature code stays in its feature folder; cross-cutting UI in `shared/`

DayFlow is a **single-owner, multi-client** workspace — not multi-tenant SaaS. One Supabase auth user owns the workspace; each client has their own auth user linked by email.

---

## Directory Architecture

```text
src/
  app/              Router, route constants (workspaceRoutes, clientPortalRoutes)
  services/         ALL Supabase access (including RPCs). Features never import supabaseClient.
  features/
    workspace/      Workspace app (/workspace)
      auth/         AuthProvider, ProtectedRoute, login/signup
      dashboard/    tasks/  projects/  clients-management/
      client-activities/   Shared with client portal
      reminders/  notifications/  analytics/  settings/
    client/         Client portal (/client-portal)
      auth/         ClientProtectedRoute, ClientPublicRoute
      layouts/      ClientAppLayout
      pages/        Dashboard, projects, etc.
      providers/    ClientPortalProvider
      hooks/        useClientDashboard
  shared/           ui/, components/, layouts/, hooks/, utils/
```

Each feature may contain: `components/`, `constants/`, `hooks/`, `pages/`, `types/`, `utils/`.

---

## Database & API Rules

- **Zero inline Supabase** — every call in `src/services/`
- **Use `DB` constants** — table names and `SELECT` strings in `src/services/db.ts` only
- **RLS is law** — every table has RLS; workspace policies use `user_id` / `owner_user_id`
- **Client portal exceptions** — use existing security definer RPCs/helpers (022–026); never grant `authenticated` access to `auth.users`
- **New migrations only** — add numbered SQL under `scripts/migrations/`; never edit applied migrations

### Client portal checklist

When touching client-visible data:

1. Project must have `project_for` set to the client (not Myself)
2. Client `email` must match portal login email
3. Prefer `fetch_client_portal_projects()` RPC over raw project queries from the client session
4. Activities: respect `raised_by` and `forClientPortal` on `useClientActivitiesQuery`

---

## Component & Hook Conventions

- **Presentational components** — target ~120 lines; extract logic to hooks
- **One concern per hook** — e.g. `useTasksQuery`, `useClientDashboard`, `useClientActivitiesQuery`
- **Prop types** — `types/components.ts`, named `ComponentNameProps`
- **Constants** — dropdown options, grid classes, routes in `constants/` files

### Reusing workspace UI in client portal

OK to import presentational blocks when scoped by props:

```tsx
<ClientActivitiesBlock
  scope="client"
  clientId={client.id}
  forClientPortal
  clientCompanyName={client.company_name}
  canEdit
  activityRaisedBy="client"
/>
```

Do not import workspace-only pages or hooks that assume `user.id` owns projects.

---

## UI, UX & Styling

- **Tailwind v4** — theme CSS variables for colors
- **Project icons** — colored background (`color_hex`) + **white** Lucide icon (`text-white`), e.g. `Folder`
- **Framer Motion** — page transitions via layout shell
- **ConfirmationModal** — before delete/archive
- **showToast** — after mutations (`success`, `error`, `info`)
- **Loading / empty** — skeletons and clear empty messages on every list page

---

## Seed & Demo Data

- Portfolio clients: `scripts/clients.md`, `bun run seed:clients`
- Client projects + activities: `bun run seed:client-projects`
- Requires `SEED_EMAIL` / `SEED_PASSWORD` in `.env`
- Seeds are idempotent where possible; client-project seed refreshes activities each run

---

## What Not to Do

- Do not put Supabase calls in feature components or hooks (use services)
- Do not reference table names as raw strings outside `db.ts`
- Do not add `auth.users` to RLS policies for the `authenticated` role
- Do not over-engineer abstractions for one-off helpers
- Do not create docs/markdown files unless asked
- Do not commit `.env` or credentials

---

## Related Docs

- [README.md](./README.md) — setup, portals overview, seed commands
- [DESIGN.md](./DESIGN.md) — schema, RLS, client auth flow, services map
