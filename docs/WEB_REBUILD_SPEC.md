# DayFlow Web: Rebuild Spec

DayFlow is a workspace for freelancers to manage clients, projects, tasks, notes, reminders and client activities. One web codebase serves two portals:

- **Workspace**: used by the freelancer (the owner).
- **Client portal**: used by the owner's clients.

The same app also ships as a desktop app through Tauri. Web, desktop and mobile all use one Supabase project.

---

## 1. Tech Stack

| Area | Choice |
|------|--------|
| Framework | React 19 + TypeScript, Vite |
| Routing | React Router 7 (`createBrowserRouter`, lazy-loaded pages) |
| Styling / UI | Tailwind CSS 4, shadcn/ui (Radix), lucide-react icons |
| Motion | framer-motion |
| Charts | recharts |
| Drag & drop | @dnd-kit (core, sortable) |
| Dates | date-fns, react-day-picker |
| Toasts | sonner |
| Theme | next-themes (light / dark, saved to profile) |
| Backend | Supabase: Auth, Postgres, Row Level Security (RLS), RPCs |
| Desktop | Tauri 2 (deep link `dayflow://` for OAuth) |
| Package manager | bun |

---

## 2. Project Architecture

```text
src/
  app/            router, route constants, lazy route helper, legacy redirects
  features/
    workspace/    owner app: auth, dashboard, tasks, projects (+ notes), clients,
                  client-activities, reminders, notifications, analytics, settings
    client/       client portal: auth, layout, pages, provider
  services/       ALL Supabase calls (one service per domain) + db.ts (table names)
  shared/         layouts, shell (header/sidebar), shared components, ui (shadcn),
                  hooks, providers, utils, unsaved-changes guard
```

- **Data flow:** `page` → `hook` → `service` → Supabase.
- **Feature folder layout:** `components/`, `hooks/`, `pages/`, `constants/`, `types/`, `utils/`.
- **Shared module:** `client-activities` is used by both portals. Portal behaviour switches on the `forClientPortal` and `activityRaisedBy` props.

### Data model (Supabase tables)

`profiles`, `projects`, `notes`, `project_reference_links`, `note_reference_links`, `clients`, `client_conversation_messages`, `tasks`, `todos`, `reminders`, `reminder_occurrences`, `notifications`, `client_activity_tasks`, `client_activity_meetings`, `client_activity_calls`, `expo_push_tokens` (mobile).

| Field | Meaning |
|-------|---------|
| `projects.project_for` | `null` = personal project; client UUID = client project |
| `projects.is_active` | Active / inactive (no archive) |
| `*.raised_by` | `workspace` or `client`: who created the activity |
| `clients.owner_user_id` | The workspace owner who owns the client |
| `clients.auth_user_id` | Linked client-portal login |

---

## 3. Root Layout

Both portals use the same shell (`AppShellLayout`). Only the config passed to it differs.

```text
┌──────────────┬─────────────────────────────────────────┐
│              │  Header                                 │
│  Left        ├─────────────────────────────────────────┤
│  Sidebar     │                                         │
│              │  Main content area                      │
│              │  (<Outlet />, pages switched by         │
│              │   React Router)                         │
└──────────────┴─────────────────────────────────────────┘
```

- **Left sidebar**
  - Brand (logo + portal subtitle)
  - Nav items
  - Quick Action card
  - Profile row
  - Collapsible on desktop. On mobile it is replaced by a slide-in sheet.
- **Header**
  - Sidebar collapse toggle (opens the mobile nav sheet on mobile)
  - Page search ("Search pages...")
  - Theme toggle
  - Header actions: the workspace shows a notifications bell with an unread badge
  - User menu: account / settings / sign out
- **Main content**
  - Scrollable area with page transitions
  - Each page starts with a page header (eyebrow, heading, description)
- **Global wrappers**
  - Auth provider, theme provider, toaster
  - Unsaved-changes guard: when a form is dirty, a modal confirms before navigating away

### Workspace sidebar nav

1. Dashboard
2. Tasks Calendar
3. Projects Management
4. Clients Management
5. Daily Reminders
6. Notifications
7. Analytics
8. Settings

Quick Action card: "Quick Actions" → opens Tasks Calendar.

### Client portal sidebar nav

1. Dashboard
2. Projects
3. Notifications
4. Analytics
5. Settings

Quick Action card: "Your projects" → opens Projects.

---

## 4. Routes

### Shared / auth

| Route | Purpose |
|-------|---------|
| `/` | Redirects to the right portal |
| `/auth/oauth-callback` | OAuth popup callback (both portals) |
| `/auth/desktop-oauth-bridge` | Forwards OAuth to the desktop deep link |
| `/admin-portal/*` | Legacy path, redirects to `/workspace/*` |

### Workspace (`/workspace`)

| Route | Page | Guard |
|-------|------|-------|
| `/workspace/auth` | Login / Sign up / Forgot / Reset password | Public only |
| `/workspace` | Redirects to dashboard | Protected |
| `/workspace/dashboard` | Dashboard | Protected |
| `/workspace/tasks-calendar` | Tasks Calendar | Protected |
| `/workspace/projects-management` | Projects list | Protected |
| `/workspace/projects-management/:id` | Project detail | Protected |
| `/workspace/projects-management/:id/notes/:noteId` | Note editor | Protected |
| `/workspace/clients-management` | Clients list | Protected |
| `/workspace/clients-management/:id` | Client detail | Protected |
| `/workspace/daily-reminders` | Daily Reminders | Protected |
| `/workspace/notifications` | Notifications inbox | Protected |
| `/workspace/analytics` | Analytics | Protected |
| `/workspace/settings` | Settings | Protected |
| `/workspace/*` | Redirects to dashboard | Protected |

Legacy redirects (keep or drop):

- `/projects` → `projects-management`
- `/projects/:id` → `projects-management/:id`
- `/clients` → `clients-management`
- `/tasks` and `/calendar` → `tasks-calendar`
- `/reminders` → `daily-reminders`

### Client portal (`/client-portal`)

| Route | Page | Guard |
|-------|------|-------|
| `/client-portal/auth` | Client login / sign up | Public only |
| `/client-portal/not-a-client` | Shown when the email isn't linked to any client | None |
| `/client-portal/dashboard` | Client dashboard | Client protected |
| `/client-portal/projects` | Shared projects | Client protected |
| `/client-portal/projects/:id` | Project detail + activities | Client protected |
| `/client-portal/notifications` | Notifications | Client protected |
| `/client-portal/analytics` | Analytics | Client protected |
| `/client-portal/settings` | Settings | Client protected |
| `/client-portal/*` | Redirects to dashboard | Client protected |

---

## 5. Features

### Auth (both portals)

- Email + password: login, sign up, forgot password, reset password.
- Google OAuth. Web uses a popup; desktop opens the system browser and returns through the `dayflow://` deep link. A Facebook button exists but is disabled.
- One-click demo account login.
- Client portal entry flow:
  1. The login email is matched to a `clients.email` record by the `link_client_portal_user()` RPC.
  2. If there is no match, the user is sent to `/not-a-client`.

### Workspace

**Dashboard**
- Greeting, plus date filters: All, This Month, Last Month, Last 3 Months, custom range.
- Four stat cards, each linking to its page, with a sparkline and trend:
  - Pending tasks
  - Overdue tasks
  - Projects
  - Completed tasks
- Task Completion chart: area chart comparing a selected month against a second month.
- Todo List:
  - Add, edit, delete and complete todos
  - Drag to reorder
- Time Tracker: a stopwatch with start, pause and reset.
- Placeholder cards: "Weekly insights" and "Activity snapshot".

**Tasks Calendar**
- Month calendar laid out as weeks with day cells. A month bar handles navigation.
- Day panel: tasks for the selected day, with drag to reorder.
- Task create / edit / delete:
  - Fields: title, description, priority, due date + time.
  - Status: todo, in progress, done, missed.
  - Status legend shown on the page.

**Projects Management**
- Projects list with search and an Active / Inactive filter, drag to reorder.
- Create / edit / delete a project:
  - Fields: name, color.
  - "Project for": personal or a client.
  - Active toggle.
- Project detail:
  - Info and edit
  - Activate / deactivate
  - Delete, which also deletes the project's notes
  - Reference links (URL + label)
  - Notes table: sortable, searchable, filterable by category
  - Client activities, for client projects
- Notes:
  - Full-page editor with title, body and category (general, meeting, research, decision, reference)
  - Per-note reference links

**Clients Management**
- Clients table with search and an Active / Inactive filter.
- Create / edit / delete a client. Fields:
  - Company name
  - Client name
  - Mobile
  - Email (this is the client's portal login)
  - Secondary contact name + number
  - Website
  - Active toggle
- Client detail page:
  - Summary
  - Client's projects, plus "New project" with this client prefilled
  - Client activities
  - Conversation (chat messages with the client)
  - Delete client

**Client Activities** (shared by both portals)
- Three activity types, each with its own fields:
  - **Tasks:** priority (low / medium / high), ETA date + time.
  - **Meetings:** from/to date + time, venue (client location / in office / online).
  - **Calls:** start date + time, duration in minutes.
- Status for all types: pending, in progress, completed.
- Each type is split into "Open" and "Closed" sections, with a project selector.
- `raised_by` tracks who created each activity: the workspace or the client.

**Daily Reminders**
- Recurring reminders. Fields:
  - Title, description
  - Time
  - Days of the week
  - Disable, either indefinitely or "until a date"
- Weekly table view: reminders per weekday cell.
- Create / edit / delete.

**Notifications**
- Inbox split into two tables: Reminders and Tasks.
- Mark as read.
- The unread count shows as a badge on the header bell.

**Analytics**
- Stat cards: Total tasks, Completed, Completion rate, Total notes.
- Task status pie chart: To Do / In Progress / Completed / Missed.
- Notes-per-project bar chart.

**Settings**
- Profile: display name, avatar URL.
- Change email (with a confirmation step).
- Set a password, or send a reset link.
- Theme: light / dark, saved to the profile.

### Client portal

- **Dashboard:**
  - Stat cards: Active projects, Tasks completed, Meetings completed, Calls attended.
  - Activities block across all shared projects.
- **Projects:** the projects shared with this client, i.e. projects where `project_for` is this client.
- **Project detail:** project info, plus that project's activities. Clients can raise tasks, meetings and calls; these are saved with `raised_by = client`.
- **Notifications:** empty state only ("No notifications yet"); there is no data behind it yet.
- **Analytics:** currently reuses the workspace analytics page. It needs a client-specific version.
- **Settings:** reuses the workspace settings page.

---

## 6. Notifications

### In-app (current)

- Stored in the `notifications` table:
  - `notification_type`: `reminder` or `task`
  - `status`: `unread` or `read`
  - `related_id`, `read_at`
- **Reminder alerts are generated client-side.**
  - While the reminders page is open, a 60-second interval checks for any reminder that is due today at the current time (±1 minute).
  - For each due reminder, it inserts one notification per reminder per day and shows a toast.
- **Task notifications:** the type exists, but nothing creates them yet.
- **Badge refresh:** the header badge updates through a `notifications-updated` window event.
- **Client portal:** has no notifications yet.

### Email (current)

- Only Supabase Auth emails exist: sign-up confirmation, password reset and email change.
- No transactional or product emails (e.g. activity raised, reminder digest). A PHP or cron email service was planned but never built.

### Rebuild targets

- Generate notifications on the server, using a Supabase cron or Edge Function, not a browser interval.
- Add in-app notifications for:
  - Tasks: due, overdue, missed
  - Client activity created or updated, in both directions
  - New client chat messages
- Give the client portal a real notifications inbox.
- Add transactional email for key events (activity raised, upcoming meetings or calls, daily digest), with per-user preferences.
- Mobile push through `expo_push_tokens` for the same events.

---

## 7. Rules

- **Supabase only through `services/`.** Features never import Supabase directly.
- **Table and column names live only in `services/db.ts`.**
- **RLS is the access contract.**
  - Owners are scoped by `user_id` / `owner_user_id`.
  - Clients never own projects. They get access only through these RPCs:
    - `link_client_portal_user()`
    - `fetch_client_portal_projects()`
    - `client_portal_can_access_project(uuid)`
  - Clients can write activities only with `raised_by = 'client'`.
- **Never grant `SELECT` on `auth.users`** to authenticated users.
- **Migrations** go in `scripts/migrations/` as the next numbered SQL file. They are append-only: never edit an applied migration.
- **Page logic lives in hooks.** Keep presentational components small (~120 lines). Prop types are named `ComponentNameProps`.
- **Mutation feedback:**
  - Show a toast after every mutation.
  - Show a confirmation modal before every delete.
  - Use the unsaved-changes guard on dirty forms.
- **Brand copy** (name, tagline, descriptions) comes only from `shared/brand/brandManifest.json`.
- **Client-portal code:**
  - Reuse presentational workspace blocks through portal props.
  - Never use owner-only hooks that assume `user.id` owns the data.
- **Secrets:** never commit `.env`, credentials or `src-tauri/target/`.
