# DayFlow — Admin & Client Portals

DayFlow is a personal workspace for freelancers and small agencies: manage your own tasks, projects, and notes in the **admin portal**, and give clients a read-only **client portal** to view shared projects and raise activities.

Built for speed, clean aesthetics, and a simple architecture.

---

## Tech Stack

- **Frontend:** React 19, React Router 7, Tailwind CSS v4, Framer Motion, Recharts
- **Language:** TypeScript
- **Package Manager:** Bun
- **Build:** Vite 8
- **Backend:** Supabase (Auth, Postgres, Row Level Security)
- **Deployment:** Static hosting (Vite `dist/`) + Supabase

---

## Two Portals

| Portal | Base path | Who |
|--------|-----------|-----|
| **Admin** | `/admin-portal` | You (freelancer / agency owner) |
| **Client** | `/client-portal` | Your clients (separate auth) |

Legacy paths (`/dashboard`, `/auth`, etc.) redirect to the admin portal.

### Admin portal

Dashboard, tasks calendar, projects (with notes & reference links), clients management, daily reminders, notifications, analytics, settings.

### Client portal

Dashboard, projects (read-only), notifications, analytics, settings. Clients can view activities on shared projects and raise tasks / meetings / calls (`raised_by = 'client'`).

**Client access:** sign up or log in at `/client-portal/auth` with an email that matches `clients.email` in your admin account. First login links their auth user to the client row via `link_client_portal_user()`.

---

## Workspace Layout

```text
dayflow/
  docs/                    README, DESIGN, AGENTS (this folder)
  scripts/
    migrations/            Numbered SQL for Supabase (001–026)
    seed-*.ts              Demo data seed scripts
    clients.md             Portfolio client reference table
  src/
    app/                   Router, route constants, global styles
    services/              Supabase client + all data access
    features/
      admin/               Admin portal features
        auth/              Login, signup, AuthProvider
        dashboard/         KPIs, focus list, completion chart
        tasks/             Personal tasks calendar
        projects/          Projects, notes, reference links
        clients-management/  Clients CRUD, chat, detail
        client-activities/   Shared tasks/meetings/calls (admin + client)
        reminders/         Recurring reminders
        notifications/     In-app notification inbox
        analytics/         Charts
        settings/          Profile & preferences
      client/              Client portal only
        auth/              Client login, protected routes
        layouts/           Client sidebar shell
        pages/             Dashboard, projects, etc.
        providers/         ClientPortalProvider
        hooks/             useClientDashboard
    shared/                Cross-portal UI, layouts, utils
```

---

## Core Features

### Admin (personal + business)

1. **Dashboard** — Stats, task completion chart, focus list
2. **Tasks calendar** — Personal tasks with status and priority
3. **Projects** — Folders with notes, reference links, optional **Project for** (client)
4. **Clients** — Contact records; link to projects via `project_for`
5. **Client activities** — Tasks, meetings, calls per client project (admin or client raised)
6. **Reminders** — Recurring daily reminders
7. **Notifications** — Task/reminder inbox
8. **Analytics** — Completion and notes charts

### Client portal

1. **Dashboard** — Active projects, activity stats, open/closed activities
2. **Projects** — Read-only list and detail for projects assigned to them
3. **Activities** — View all; edit only items they raised

---

## Environment

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
SEED_EMAIL=          # optional — for seed scripts
SEED_PASSWORD=
```

---

## Seed Scripts

Run against your Supabase project (requires `.env`):

```bash
bun run seed:dummy           # Personal projects + notes + tasks + reminders
bun run seed:clients         # Portfolio clients (see scripts/clients.md)
bun run seed:client-projects # Client-assigned projects + notes + links + activities
bun run seed:task-months     # Historical tasks by month
```

---

## Database Migrations

Apply in order in the Supabase SQL editor: `scripts/migrations/001` … `026`.

**Client portal (run after 019–021):**

| Migration | Purpose |
|-----------|---------|
| 020 | Client portal columns, activity `raised_by`, base RLS |
| 021 | Self-link by email, drop `portal_enabled` |
| 022 | `link_client_portal_user()` RPC |
| 023 | Harden link RPC (JWT/metadata email fallbacks) |
| 024 | `fetch_client_portal_projects()` + projects RLS |
| 025 | Fix RLS (no direct `auth.users` reads) |
| 026 | Access helpers (`client_portal_can_access_project`, activity RLS) |

---

## Reference Project

Dashboard charts, split-pane notes, and orange/teal accents follow patterns from the Digi Carotene team portal:

```text
../../digi-carotene-projects/digi-carotene/digi-carotene-sm-app
```

Client portal project listing/detail patterns were inspired by the same codebase.

---

## Docs

- [DESIGN.md](./DESIGN.md) — Architecture, schema, auth, client portal data model
- [AGENTS.md](./AGENTS.md) — Coding rules for humans and AI agents
