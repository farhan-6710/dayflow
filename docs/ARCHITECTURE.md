# Architecture — DayFlow

## System

```text
Web (Vite) ──┐
Desktop (Tauri wraps Vite) ──┤──► one Supabase project
Mobile (Expo) ───────────────┘      Auth · Postgres · RLS
```

No sync service. RLS is the access contract.

| Client | Data path |
|--------|-----------|
| Web / desktop | `pages` → `hooks` → `apps/web/src/services/` → Supabase |
| Mobile | screens/hooks → `apps/mobile/src/services/` → `lib/supabase.ts` |

Env: web `VITE_SUPABASE_*`; mobile `EXPO_PUBLIC_SUPABASE_*` — same project values.

## Dual-portal routing (web/desktop)

| Route | Guard | Who |
|-------|-------|-----|
| `/workspace/auth` | PublicRoute | Owner |
| `/workspace/*` | ProtectedRoute + AppLayout | Owner |
| `/client-portal/auth` | ClientPublicRoute | Client |
| `/client-portal/*` | ClientProtectedRoute + ClientAppLayout | Client |
| `/admin-portal/*` | Redirect → `/workspace/*` | Legacy |

Client entry: `resolveClientPortalProfile()` → `link_client_portal_user()`.

## Schema (summary)

```text
profiles
  ├── projects (user_id, project_for, is_active)
  │     ├── notes (+ note_reference_links)
  │     ├── reference_links
  │     └── client_activity_* (raised_by: workspace | client)
  ├── clients (owner_user_id, auth_user_id, email)
  │     └── client_conversation_messages
  ├── tasks, reminders → reminder_occurrences
  ├── notifications
  └── expo_push_tokens
```

| Concept | Meaning |
|---------|---------|
| `project_for` | `null` = personal; UUID = client project |
| `raised_by` | Who created the activity |
| `owner_user_id` | Workspace owner on `clients` |
| `is_active` | Project active/inactive (not archive) |

## Client portal security

Clients never own `projects`. Access only via:

- `link_client_portal_user()`
- `fetch_client_portal_projects()`
- `client_portal_can_access_project(uuid)`

Never grant `SELECT ON auth.users TO authenticated`. Clients read activities on accessible projects; write only when `raised_by = 'client'`.

## Shared module

`apps/web/src/features/workspace/client-activities/` — used in workspace and client portal (`forClientPortal`, `activityRaisedBy`).

## Services (web/desktop)

`authService` · `projectsService` · `clientsService` · `clientPortalService` · `clientActivitiesService` · `notificationsService` · `tasksService` · `remindersService` · `notesService`

Table names live in each app’s `db.ts` only.

## Platforms

- **Desktop:** `apps/web/src-tauri/` — Tauri 2; Google OAuth via system browser + `dayflow://` deep link + PKCE bridge
- **Mobile:** reminders + `expo_push_tokens` for the same `auth.uid()`
- **Migrations:** `scripts/migrations/` (001–033+) — append-only; never edit applied files
