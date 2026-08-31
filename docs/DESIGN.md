# Architecture & Design — DayFlow

Software design, database schema, routing, and client portal patterns.

---

## Data Flow Pattern

```text
Database (Supabase)
      ▲
      │ (API call / RPC)
src/services/
      ▲
      │ (data, actions, loading)
features/*/hooks/
      ▲
      │ (compose hooks, pass props)
features/*/pages/
      └──► features/*/components/
```

1. **Pages** — Route views; orchestrate hooks, no heavy markup
2. **Components** — Presentational; typed props, Tailwind styling
3. **Hooks** — State, validation, service calls
4. **Services** — Supabase queries, RPCs, type mapping

---

## Dual-Portal Routing

```text
/workspace/auth             Workspace login/signup (PublicRoute)
/workspace/*                Workspace app (ProtectedRoute + AppLayout)
/admin-portal/*             Legacy redirect → /workspace/*

/client-portal/auth         Client login/signup (ClientPublicRoute)
/client-portal/not-a-client Email not matched to any client
/client-portal/*            Client app (ClientProtectedRoute + ClientAppLayout)
```

Route constants live in:

- `src/app/constants/workspaceRoutes.ts`
- `src/app/constants/adminPortalRoutes.ts` (legacy `/admin-portal` prefix only)
- `src/app/constants/clientPortalRoutes.ts`

`ClientProtectedRoute` calls `resolveClientPortalProfile()` → `link_client_portal_user()` RPC before rendering children.

---

## Database Schema (Overview)

All tables use UUID primary keys. Plans were removed (migration 007); tasks are standalone or tied to projects only on the workspace side.

```text
profiles (auth.users)
    │
    ├── projects (user_id = workspace owner)
    │       ├── project_for → clients.id (optional; client-facing projects)
    │       ├── notes
    │       ├── project_reference_links
    │       ├── client_activity_tasks
    │       ├── client_activity_meetings
    │       └── client_activity_calls
    │
    ├── clients (owner_user_id = workspace owner)
    │       ├── auth_user_id → auth.users (set on client first login)
    │       └── client_conversation_messages
    │
    ├── tasks (personal workspace tasks)
    ├── reminders
    └── notifications
```

### Key tables

| Table | Owner column | Notes |
|-------|--------------|-------|
| `profiles` | `id` = auth user | Theme, display name |
| `projects` | `user_id` | Workspace owner holds all project rows |
| `clients` | `owner_user_id` | One email per workspace owner; `auth_user_id` for portal |
| `notes` | `user_id` | Scoped to `project_id` |
| `client_activity_*` | via `project_id` | `raised_by`: `'workspace'` \| `'client'` |

### Project assignment

- **Myself** — `project_for` is `null` (personal workspace project)
- **Client project** — `project_for` = client UUID; visible in client portal when client email matches

---

## Row Level Security

### Workspace tables

Standard owner policy:

```sql
using (auth.uid() = user_id)  -- or owner_user_id for clients
```

Workspace users read/write their own tasks, projects, notes, clients, etc.

### Client portal

Clients do **not** own project rows (`projects.user_id` is the workspace owner). Access uses:

1. **Security definer RPCs** — bypass RLS safely inside controlled functions
2. **Email / `auth_user_id` policies** — match logged-in user to `clients.email` or `clients.auth_user_id`

Important RPCs and helpers (migrations 022–026):

| Function | Role |
|----------|------|
| `link_client_portal_user()` | Link auth user → client row by email |
| `fetch_client_portal_projects()` | List non-archived projects for current client email |
| `client_portal_resolved_email()` | JWT + auth.users email (security definer) |
| `client_portal_can_access_project(uuid)` | Shared check for projects + activities RLS |

**Do not** grant `SELECT ON auth.users TO authenticated`. Use security definer helpers instead.

### Client activity rules

- **Read** — any activity on projects they can access
- **Insert / update** — only when `raised_by = 'client'` (and their own updates)

Workspace users manage all activities via `projects.user_id = auth.uid()`.

---

## Client Portal Auth Flow

```text
1. User signs up/logs in at /client-portal/auth (email must match clients.email)
2. ClientProtectedRoute → resolveClientPortalProfile()
3. link_client_portal_user() sets clients.auth_user_id on first match
4. ClientPortalProvider exposes linked client row to pages
5. fetch_client_portal_projects() returns projects where project_for → client email match
```

**Magic link note:** session JWT may not include `email` immediately. Migrations 023/026 resolve email from JWT fallbacks and `auth.users` inside security definer functions. After first login, a full re-login or refresh (with 026 applied) ensures `auth_user_id` is set.

---

## Client Activities (shared module)

`src/features/workspace/client-activities/` is reused in both portals:

| Scope | Where | Query |
|-------|-------|-------|
| `project` | Workspace project detail | By `project_id` |
| `client` | Workspace client detail | By client's projects |
| `client` + `forClientPortal` | Client dashboard/detail | Portal-scoped fetch + RLS |

Props: `activityRaisedBy`, `canEdit`, `editOnlyRaisedBy` (client portal).

---

## Authentication (Workspace)

- **PublicRoute** — redirects authenticated users away from `/workspace/auth`
- **ProtectedRoute** — requires session; wraps `AppLayout`
- **AuthProvider** — session sync, profile load, password recovery flag

Client portal mirrors this with `ClientPublicRoute` / `ClientProtectedRoute`.

---

## Frontend Services Map

| Service | Responsibility |
|---------|------------------|
| `authService` | Sign in/up, OAuth, metadata sync |
| `projectsService` | CRUD + `fetchProjectsForClientPortal` |
| `clientsService` | Workspace client CRUD |
| `clientPortalService` | Link RPC, profile resolve |
| `clientActivitiesService` | Tasks, meetings, calls |
| `notesService` | Project notes |
| `projectReferenceLinksService` | Reference URLs |
| `clientChatMessagesService` | Workspace–client chat |
| `tasksService` | Personal workspace tasks |
| `remindersService` | Recurring reminders |
| `notificationsService` | In-app notifications |
| `profilesService` | User profile |

Table/column names: `src/services/db.ts` only.

---

## Migrations Index

| Range | Topic |
|-------|--------|
| 001–008 | Core schema, tasks, notes, reminders |
| 009–010 | Notifications, task missed status |
| 011–018 | Clients, project_for, reference links, owner column (was `admin_id`) |
| 027 | Workspace terminology rename |
| 019 | Client activity tables |
| 020–026 | Client portal auth, linking, projects RPC, RLS fixes |

Always add **new** migration files; do not edit ones already applied in production.

---

## UI Patterns

- **Project color chip** — `backgroundColor: color_hex`, white `Folder` icon (`text-white`)
- **Directory tables** — `DirectoryTable` + `DirectoryTableRow` for clients/projects lists
- **Page shell** — `PageHeader` + `PageContent`
- **Transitions** — Framer Motion via layout / `TransitionLink`
- **Destructive actions** — `ConfirmationModal` before delete
- **Feedback** — `showToast('success' \| 'error' \| 'info', message)`
