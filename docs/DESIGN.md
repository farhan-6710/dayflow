# Architecture & Design — DayFlow

For interviewers and contributors. Product demo: [README.md](./README.md).

---

## System overview

```text
Web (Vite dist/)     ──► apps/web/src/services/     ──┐
Desktop (Tauri wraps     (same React app as web)      ├──► one Supabase project
  the Vite app)                                       │      Auth + Postgres + RLS
Mobile (Expo)        ──► apps/mobile/src/services/  ──┘
```

All three clients use the **same** hosted project. Web/desktop and mobile each have their own `createClient` and `db.ts`, but they point at the same URL/key and the same tables. RLS (`user_id = auth.uid()`, client-portal RPCs) is the access contract — there is no extra sync service.

**Data flow (web/desktop):** `pages` → `hooks` → `apps/web/src/services/` → Supabase. No inline Supabase in features.

**Data flow (mobile):** screens/hooks → `apps/mobile/src/services/` → `apps/mobile/src/lib/supabase.ts` → the same Supabase. Mobile currently covers owner reminders, occurrence rows, and Expo push tokens.

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
  ├── tasks, reminders → reminder_occurrences
  ├── notifications
  └── expo_push_tokens   (mobile devices for the same user_id)
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

`apps/web/src/features/workspace/client-activities/` used in both portals.

| Scope | Context |
|-------|---------|
| `project` | Workspace project detail |
| `client` | Workspace client detail |
| `client` + `forClientPortal` | Client dashboard / project detail |

---

## Auth

- **Workspace (web/desktop):** AuthProvider, email/password + Google OAuth, PublicRoute / ProtectedRoute
- **Client portal (web/desktop):** ClientPortalProvider, email must match `clients.email`
- **Mobile:** same Auth users via `signInWithPassword`; session persisted with AsyncStorage. The demo workspace owner is the same `auth.uid()` as on web. Google OAuth on mobile is not wired the same way as the Tauri deep-link flow.

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

All web/desktop table names in `apps/web/src/services/db.ts`. Mobile names in `apps/mobile/src/services/db.ts` (`reminders`, `reminder_occurrences`, `expo_push_tokens`) — same Postgres relations.

---

## Desktop (Tauri)

- Shell: `apps/web/src-tauri/` — Rust wraps Vite `dist/` in production, dev server in development
- Config: `tauri.conf.json` (window, CSP, bundle, identifier `com.dayflow.app`)
- Build output: `apps/web/src-tauri/target/release/bundle/dmg/*.dmg` (macOS)
- Same Supabase client as web (`VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY`)

---

## Mobile (Expo)

- App: `apps/mobile/` — Expo Router, preview APKs via EAS (`distribution: internal`)
- Client: `apps/mobile/src/lib/supabase.ts` (`EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_KEY`)
- Reads/writes the shared `reminders` rows for `auth.uid()`; registers device tokens in `expo_push_tokens`
- Android preview: see [README.md](./README.md#install-dayflow-mobile). iOS: coming soon

---

## Migrations (contributors)

Numbered SQL in `scripts/migrations/` (001–029). Production DB is live — add new files only, never edit applied migrations. Key ranges: 011–018 clients/projects, 019–026 client portal + RLS, 027 workspace terminology, 028–029 mobile reminder fields + occurrences + Expo push tokens.

---

## UI patterns

- Project chip: `color_hex` background + white Lucide icon
- Lists: `DirectoryTable` + `DirectoryTableRow`
- Pages: `PageHeader` + `PageContent`
- Feedback: `showToast`, `ConfirmationModal` for destructive actions
