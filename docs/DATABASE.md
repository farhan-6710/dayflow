# Database — DayFlow

One Supabase project for web, desktop and mobile. **Apps never change the database.** They only read and write existing tables. See [RULES.md](./RULES.md).

## Model

```text
profiles
  ├── projects (user_id, project_for, is_active)
  │     ├── notes → note_reference_links
  │     ├── project_reference_links
  │     └── client_activity_tasks | client_activity_meetings | client_activity_calls  (raised_by)
  ├── clients (owner_user_id, auth_user_id, email)
  │     └── client_conversation_messages
  ├── tasks, todos
  ├── reminders → reminder_occurrences
  ├── notifications
  ├── user_settings
  └── expo_push_tokens   (old mobile; unused while push is on hold)
```

| Field | Meaning |
|-------|---------|
| `project_for` | `null` = personal; client UUID = client project |
| `is_active` | Active / inactive (no archive) |
| `raised_by` | `workspace` or `client` |
| `owner_user_id` | Workspace owner of a client |

Column selects: `apps/web/src/services/db.ts`. Mobile will keep its own names in Dart when it connects.

## Client portal

Clients never own `projects`. Access only through:

- `link_client_portal_user()` — link login email to a `clients` row
- `fetch_client_portal_projects()` — projects shared with the client
- `client_portal_can_access_project(uuid)` — per-project check

Clients read activities on accessible projects and write only with `raised_by = 'client'`. Never grant `SELECT` on `auth.users`.

## Contract (do not change from app work)

**Tables:** `profiles`, `projects`, `notes`, `note_reference_links`, `project_reference_links`, `clients`, `client_conversation_messages`, `tasks`, `todos`, `reminders`, `reminder_occurrences`, `notifications`, `client_activity_tasks`, `client_activity_meetings`, `client_activity_calls`, `user_settings`, `expo_push_tokens`

**RPCs / triggers:** `link_client_portal_user`, `fetch_client_portal_projects`, `client_portal_can_access_project`, `client_portal_session_email`, `client_portal_resolved_email`, `handle_new_user`, `handle_updated_at`

**Migrations:** append-only in `scripts/migrations/`. Owner applies by hand. Do not edit an applied file. Known owner-applied exceptions: `038_drop_profiles_theme_preference.sql`, `039_notes_category_nullable.sql`, `040_user_settings.sql`.
