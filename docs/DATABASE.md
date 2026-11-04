# Database — DayFlow

One Supabase project serves web and mobile. **The database is never changed by an app rebuild.** Apps read and write existing tables only; see [RULES.md](./RULES.md).

## Data model

```text
profiles
  ├── projects (user_id, project_for, is_active)
  │     ├── notes (+ note_reference_links)
  │     ├── project_reference_links
  │     └── client_activity_tasks | _meetings | _calls  (raised_by)
  ├── clients (owner_user_id, auth_user_id, email)
  │     └── client_conversation_messages
  ├── tasks, todos
  ├── reminders → reminder_occurrences
  ├── notifications
  └── expo_push_tokens (mobile)
```

| Field | Meaning |
|-------|---------|
| `project_for` | `null` = personal; client UUID = client project |
| `is_active` | Active / inactive (no archive) |
| `raised_by` | `workspace` or `client`: who created the activity |
| `owner_user_id` | Workspace owner of a client |

Exact columns per table: `apps/web/src/services/db.ts` (the old one is recoverable from git, see [WEB_ENV_AND_LINKS.md](../apps/web/docs/WEB_ENV_AND_LINKS.md)). Mobile keeps its own copy of the names.

## Client portal security

Clients never own `projects`. Access only through:

- `link_client_portal_user()`: links the login email to a `clients` row
- `fetch_client_portal_projects()`: projects shared with the client
- `client_portal_can_access_project(uuid)`: per-project check

Clients read activities of accessible projects and write only with `raised_by = 'client'`. Never grant `SELECT` on `auth.users`.

## Contract (do not change)

**Tables:**

`profiles` (no `theme_preference` once migration 038 is applied), `projects`, `notes`, `project_reference_links`, `note_reference_links`, `clients`, `client_conversation_messages`, `tasks`, `todos`, `reminders`, `reminder_occurrences`, `notifications`, `client_activity_tasks`, `client_activity_meetings`, `client_activity_calls`, `expo_push_tokens`

**Functions and RPCs:**

| Function | Purpose |
|----------|---------|
| `link_client_portal_user()` | Links a client-portal login to its `clients` row |
| `fetch_client_portal_projects()` | Returns the projects shared with the signed-in client |
| `client_portal_can_access_project(uuid)` | Checks client access to one project |
| `client_portal_session_email()` | Helper used by the client-portal functions |
| `client_portal_resolved_email()` | Helper used by the client-portal functions |
| `handle_new_user()` | Trigger that creates the `profiles` row |
| `handle_updated_at()` | Trigger that maintains `updated_at` |

**Where the schema lives and how it is protected:**

- Schema history: `scripts/migrations/001–037` at the repo root. Kept, and append-only.
- Exact column selects per table: in the old `apps/web/src/services/db.ts`, recoverable from git (commit `b1335f3`).
- RLS policies stay as they are. The new code must work within them.
