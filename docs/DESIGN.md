# Architecture & Design — DayFlow

For interviewers and contributors. Product demo: [README.md](./README.md).

---

## System overview

```text
Web (Vite dist/)  ──┐
Desktop (Tauri)   ──┼──► React UI ──► src/services/ ──► Supabase (Auth + Postgres + RLS)
Mobile (Expo)*    ──┘

* separate repo; same Supabase backend
```

**Data flow:** `pages` → `hooks` → `services` → Supabase. No inline Supabase in features.

---

## Dual-portal routing

| Route | Guard | User |
|-------|-------|------|
| `/workspace/auth` | PublicRoute | Owner login/signup |
| `/workspace/*` | ProtectedRoute + AppLayout | Owner app |
| `/client-portal/auth` | ClientPublicRoute | Client login |
| `/client-portal/*` | ClientProtectedRoute + ClientAppLayout | Client app |
| `/admin-portal/*` | Legacy redirect → `/workspace/*` | — |

Constants: `workspaceRoutes.ts`, `clientPortalRoutes.ts`, `adminPortalRoutes.ts` (legacy prefix only).

Client entry: `resolveClientPortalProfile()` → `link_client_portal_user()` RPC.

---

## Schema (summary)

```text
profiles
  ├── projects (user_id) → notes, reference_links, client_activity_*
  ├── clients (owner_user_id, auth_user_id, email)
  │     └── client_conversation_messages
  ├── tasks, reminders, notifications
```

| Concept | Detail |
|---------|--------|
| `project_for` | `null` = personal project; UUID = client-facing project |
| `raised_by` | `'workspace'` \| `'client'` on activity tables |
| `owner_user_id` | Workspace owner on `clients` (was `admin_id`) |

---

## Client portal security

Clients never own `projects` rows. Access via:

- `link_client_portal_user()` — link auth user to client by email
- `fetch_client_portal_projects()` — list projects for client session
- `client_portal_can_access_project(uuid)` — RLS helper for activities

Never grant `SELECT ON auth.users TO authenticated`.

**Activities:** clients read all on accessible projects; write only when `raised_by = 'client'`.

---

## Shared module: client-activities

`src/features/workspace/client-activities/` used in both portals.

| Scope | Context |
|-------|---------|
| `project` | Workspace project detail |
| `client` | Workspace client detail |
| `client` + `forClientPortal` | Client dashboard / project detail |

---

## Auth

- **Workspace:** AuthProvider, email/password + Google OAuth, PublicRoute / ProtectedRoute
- **Client:** ClientPortalProvider, email must match `clients.email`

---

## Services map

| Service | Role |
|---------|------|
| `authService` | Sign in/up, OAuth |
| `projectsService` | CRUD, client portal fetch |
| `clientsService` | Client CRUD |
| `clientPortalService` | Link RPC, profile |
| `clientActivitiesService` | Tasks, meetings, calls |
| `notificationsService` | In-app task/reminder alerts |
| `tasksService`, `remindersService`, `notesService` | Core workspace data |

All table names in `src/services/db.ts`.

---

## Desktop (Tauri)

- Shell: `src-tauri/` — Rust wraps Vite `dist/` in production, dev server in development
- Config: `tauri.conf.json` (window, CSP, bundle, identifier `com.dayflow.app`)
- Build output: `src-tauri/target/release/bundle/dmg/*.dmg` (macOS)

---

## Migrations (contributors)

Numbered SQL in `scripts/migrations/` (001–027). Production DB is live — add new files only, never edit applied migrations. Key ranges: 011–018 clients/projects, 019–026 client portal + RLS, 027 workspace terminology.

---

## UI patterns

- Project chip: `color_hex` background + white Lucide icon
- Lists: `DirectoryTable` + `DirectoryTableRow`
- Pages: `PageHeader` + `PageContent`
- Feedback: `showToast`, `ConfirmationModal` for destructive actions
