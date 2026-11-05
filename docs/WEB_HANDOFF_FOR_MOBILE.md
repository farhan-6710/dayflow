# DayFlow Web App: Handoff for Planning the Mobile App

Purpose of this file: describe the finished DayFlow **web** app in enough detail that a person or an AI can plan the **mobile** rebuild without reading the web code. It covers why the product exists, what it contains, the stack, every screen, the database, and where the mobile app stands.

Written 2026-11-04 from the code in the repository (`apps/web`, `apps/mobile`, `scripts/migrations`).

---

## 1. What DayFlow is and why it exists

**Tagline:** Organize your day. Elevate your flow.

DayFlow is a workspace for **freelancers** to run their day in one place: clients, projects, tasks, notes, reminders, and the requests clients send them. It replaces a scatter of notes apps, calendars and chat threads.

There are two kinds of user, in one product:

| User | What they do |
|------|--------------|
| **Workspace owner** (the freelancer) | Manages clients, projects, notes, tasks, todos, daily reminders; sees analytics; handles activities (tasks, meetings, calls) tied to client projects. |
| **Client** (the freelancer's customer) | Signs in to a **client portal**, sees only the projects shared with them, and raises tasks, meetings and calls on those projects. |

**Why it was rebuilt.** The old web app was replaced from scratch for a better UI/UX, keeping every feature and the **existing database untouched**, so existing accounts and data keep working. The web rebuild is finished. Mobile is next, in Flutter.

**Hard constraint for mobile too: the database is never changed.** No schema, RLS or data changes from app work. (The owner applies migrations by hand.)

---

## 2. Repository layout

```
apps/web/        React web app (finished rebuild)
apps/mobile/     Flutter app, to be built (docs and images for now)
shared/brand/    brandManifest.json (copy), theme.json (tokens, hex), theme.css, theme.ts
docs/            shared docs: PRD, DATABASE, RULES, MEMORY
scripts/migrations/   001-039 SQL, append-only
```

One **Supabase** project (Auth + Postgres + Row Level Security + RPCs) serves web, mobile and the old desktop build. There is no custom backend and no sync service.

---

## 3. Web stack

| Area | Choice |
|------|--------|
| Language / build | TypeScript (strict, no `any`), React 19, Vite 8, bun |
| Routing | React Router 7, lazy-loaded pages |
| UI | Tailwind CSS 4, shadcn/ui (Radix), lucide-react icons |
| Motion | framer-motion (entrance: blur + slide + fade) |
| Skeleton loading | phantom-ui (measures the real layout and shimmers over it) |
| Charts | recharts |
| Drag and drop | @dnd-kit |
| Dates | date-fns, react-day-picker |
| Toasts | sonner |
| Theme | next-themes: follows the device, a manual choice is kept in `localStorage` (not in the database) |
| Backend | Supabase JS client v2 |
| Fonts | Ovo (UI), Young Serif (headings), Merriweather (notes/long text) |

**Code architecture:** `page -> hook -> service -> Supabase`.
- Pages only compose; hooks hold state and logic; **services** are the only code that talks to Supabase.
- All table and column names live in one file, `services/db.ts`.
- Features are grouped as `features/<portal>/<feature>/{components,hooks,pages,constants,types,utils}`.
- Services: auth, oauth, profiles, projects, notes, project reference links, note reference links, clients, client portal, client activities, client chat messages, tasks, todos, reminders, notifications.

**UX rules the web app enforces everywhere** (worth copying to mobile): every list/detail screen has loading, empty and error states; every delete is confirmed and says what goes with it; every mutation shows a toast; forms that can be dirty warn before leaving; controls are disabled while saving; one primary action per page; row actions live in a kebab ("Actions") menu.

---

## 4. Design system

- Warm paper surfaces, charcoal primary, one coral accent (`#f26a4b`), serif-forward type. Calm, with soft shadows rather than decoration.
- Light and dark themes. Semantic tokens only (`background`, `card`, `muted`, `primary`, `chart-1..5`, `success`, `destructive`, `sidebar-*`, etc.).
- **Tokens are defined once** in `shared/brand/theme.json` (hex values) and generated into `theme.css` (web). Dart output for Flutter is still to come. Colours are hex so every app reads them the same way. Radius is `1rem`.
- Status colours: to do = muted, in progress = coral (`chart-1`), done = green (`success`), missed/overdue = `destructive`.
- 3D art (icons and illustrations) is used on auth screens, empty states, the sidebar quick-action card, and error / not-a-client pages. Never in stat cards or page headers.
- Everything works down to 310px wide.
- Brand copy (name, tagline, descriptions) comes only from `shared/brand/brandManifest.json`.

---

## 5. App shell (both portals)

One shell, two configs: left sidebar, header, scrollable main area.

- **Sidebar:** brand, nav items, a quick-action card, profile row. Collapses to icons on desktop; a slide-in sheet on small screens.
- **Header:** collapse toggle, breadcrumbs (home > section > detail page > note), page search, theme toggle, notifications bell with unread badge (workspace), and a user pill (avatar + first name) with a menu: Profile, Settings, Help & support, Log Out.
- **Workspace nav (8):** Dashboard, Tasks Calendar, Projects Management, Clients Management, Daily Reminders, Notifications, Analytics, Settings. Quick action: open Tasks Calendar.
- **Client portal nav (5):** Dashboard, Projects, Notifications, Analytics, Settings. Quick action: open Projects.

---

## 6. Screens and what each holds

### Auth (both portals)
- Email + password: sign in, sign up, forgot password, reset password.
- Google OAuth (web popup; desktop used a `dayflow://` deep link).
- **Workspace sign-in only:** a green "Continue with demo account" button and a dismissible card with shared demo credentials, so recruiters can try the app. (A public demo account exists; it also works in the mobile app.)
- **Client portal:** after login, the email is matched to a client record by the `link_client_portal_user()` RPC. No match sends the user to a "not a client" page.

### Workspace (owner)

**Dashboard** `/workspace/dashboard`
- Greeting; date filters: All, This Month, Last Month, Last 3 Months, custom range.
- Four stat cards (each links to its page, with a trend chip): Pending tasks, Overdue tasks, Total Projects, Completed tasks.
- Task Completion area chart: one month vs another.
- Todo list: add, edit, delete, complete, drag to reorder.
- Time tracker: stopwatch with start, pause, reset.
- "Weekly insights" and "Activity snapshot" cards derived from tasks and activities.

**Tasks Calendar** `/workspace/tasks-calendar`
- Month, Week and Day views (kept in the URL), Today button, status legend.
- Week and day are hour timelines (06:00-23:00 window, opens at 8 AM). Tasks assume 60 minutes; overlapping tasks share width; tasks with no time sit in a "No time" row.
- Clicking an empty hour creates a task at that time; clicking a task opens a details sheet (edit, delete).
- Day panel for the selected day with drag-to-reorder.
- Task fields: title, description, priority (low/medium/high), due date, due time, status (todo / in progress / done / missed).

**Projects Management** `/workspace/projects-management`
- Summary stats; paginated list (7 per page) with status tabs (active/inactive), a project-type filter (personal vs client), search, drag to reorder.
- Create/edit/delete a project: name, colour, "Project for" (personal or a client), active toggle.

**Project detail** `/workspace/projects-management/:id`
- Info, edit, activate/deactivate, delete (also deletes its notes).
- Reference links (URL + label).
- Notes table: search, category filter, drag to reorder.
- Client activities (client projects only).
- **Note editor** `/.../notes/:noteId`: full page, title + body (plain text) + category (general, meeting, research, decision, reference) + per-note reference links, duplicate, delete.

**Clients Management** `/workspace/clients-management`
- Summary stats; paginated table with status tabs, a portal-access filter, search, sortable columns.
- Create/edit/delete a client: company name, client name, mobile, email (this is the client's portal login), secondary contact name and number, website, active.

**Client detail** `/workspace/clients-management/:id`
- Summary, the client's projects (+ "New project" with the client prefilled), client activities, a **conversation** (chat messages between owner and client), delete.

**Client activities (shared block, both portals)**
- Three types: **Tasks** (priority, ETA date/time), **Meetings** (from/to date+time, venue: client location / in office / online), **Calls** (start date+time, duration in minutes).
- Status for all: pending, in progress, completed. Each type has "Open" and "Closed" sections and a project selector.
- Every item has `raised_by` = `workspace` or `client`.

**Daily Reminders** `/workspace/daily-reminders`
- Recurring reminders: title, description, time, days of the week, disable indefinitely or "until a date".
- Weekly table: one row per reminder, one column per weekday, today marked; a row opens its edit dialog.

**Notifications** `/workspace/notifications`
- Inbox split into Reminders and Tasks tables, mark as read; unread count on the header bell.

**Analytics** `/workspace/analytics`
- Stat cards (total tasks, completed, completion rate, total notes), task-status pie chart, notes-per-project bar chart.

**Account** `/workspace/account` (profile overview: identity, member-since, activity stats, quick links) and **Settings** `/workspace/settings` (profile name + avatar URL, theme, change email with confirmation, set password or send reset link, notification preferences that are only saved in the browser).

### Client portal (client)

- **Dashboard:** stat cards (Active projects, Tasks completed, Meetings completed, Calls attended) and an activities block across all shared projects.
- **Projects:** only projects shared with this client (`project_for` = this client). **Project detail** shows info plus activities; the client can raise tasks, meetings and calls (saved with `raised_by = 'client'`).
- **Notifications:** the client's own notification rows, mark as read.
- **Analytics:** activities by status and type, per project.
- **Account / Settings:** same shared cards as the workspace.

---

## 7. Database (Supabase Postgres)

Owner scoping is by `user_id` (or `owner_user_id` on clients). **RLS is the access contract.** Times are stored as display text such as `"10:00 AM"`; keep that format so web and mobile agree.

```
profiles
  |-- projects (user_id, project_for -> clients, is_active)
  |     |-- notes (+ note_reference_links)
  |     |-- project_reference_links
  |     `-- client_activity_tasks | client_activity_meetings | client_activity_calls  (raised_by)
  |-- clients (owner_user_id, auth_user_id, email)
  |     `-- client_conversation_messages
  |-- tasks, todos
  |-- reminders -> reminder_occurrences
  |-- notifications
  `-- expo_push_tokens   (from the old mobile app, unused while push is on hold)
```

| Table | Columns (as the web app reads them) |
|-------|-------------------------------------|
| `profiles` | id, display_name, avatar_url, created_at, updated_at |
| `projects` | id, user_id, name, color_hex, is_active, project_for (null = personal, client id = client project), sort_order, created_at, updated_at |
| `clients` | id, owner_user_id, company_name, client_name, mobile_number, email, secondary_contact_name, secondary_contact_number, website_url, is_active, auth_user_id, created_at, updated_at |
| `client_conversation_messages` | id, client_id, author_user_id, author_client_id, body, created_at, updated_at |
| `tasks` | id, user_id, title, description, status (todo / in_progress / done / missed), priority (low / medium / high), due_date, due_time, sort_order, created_at, updated_at |
| `todos` | id, user_id, title, description, status, sort_order, created_at, updated_at |
| `notes` | id, user_id, project_id, title, body, category, sort_order, created_at, updated_at |
| `project_reference_links` | id, project_id, user_id, url, label, created_at, updated_at |
| `note_reference_links` | id, note_id, user_id, url, label, created_at, updated_at |
| `reminders` | id, user_id, title, description, reminder_time, days_of_week, is_disabled, disabled_until, status (done / upcoming / paused / missed), category (health / fitness / work / personal, nullable), created_at, updated_at |
| `reminder_occurrences` | id, user_id, reminder_id, occurrence_date, status |
| `notifications` | id, user_id, notification_type (reminder / task), title, message, status (unread / read), related_id, created_at, read_at |
| `client_activity_tasks` | id, project_id, title, description, priority, status, eta_date, eta_time, raised_by, created_at, updated_at |
| `client_activity_meetings` | id, project_id, title, description, status, from_date, from_time, to_date, to_time, venue, raised_by, created_at, updated_at |
| `client_activity_calls` | id, project_id, title, description, status, start_date, start_time, duration_minutes, raised_by, created_at, updated_at |
| `expo_push_tokens` | id, user_id, token, last_used_at, created_at |

Activity status values: pending, in progress, completed. `raised_by`: `workspace` or `client`.

**RPCs and functions**
- `link_client_portal_user()`: links a client login to its `clients` row by email.
- `fetch_client_portal_projects()`: the projects shared with the signed-in client.
- `client_portal_can_access_project(uuid)`: per-project access check.
- `client_portal_session_email()`, `client_portal_resolved_email()`: helpers.
- `handle_new_user()` (trigger: creates the `profiles` row), `handle_updated_at()` (trigger).

**Client portal security.** Clients never own projects. They read activities of accessible projects and may write activities only with `raised_by = 'client'`. `SELECT` on `auth.users` is never granted.

**Migrations (owner applies, agents never do):** 001-037 are applied history. Note these newer files; confirm with the owner whether they are applied before relying on them:
- `038`: drops `profiles.theme_preference` and redefines `handle_new_user()`. Apply only after the new web build is deployed.
- `039`: makes `notes.category` nullable (drops the default and the check constraint), so a note can have no category.

---

## 8. Behaviours worth knowing

- **Reminder alerts are made in the browser.** While a web tab is open, a 60-second timer inserts one notification per due reminder per day and shows a toast. There is **no server job**, so nothing fires when the app is closed. Mobile can do better with local scheduled notifications and/or push.
- **Task notifications:** the type exists, but nothing creates them yet. Client notifications: an inbox exists, nothing creates rows yet.
- **Email:** only Supabase Auth emails (sign-up confirmation, password reset, email change). No product emails.
- The completion chart counts done tasks by `updated_at`, because `tasks` has no completed-at column.
- Sign-out is local-scope, so signing out never ends other sessions on the shared demo account.
- Theme is not stored in the database.

**Needs an owner decision, because each would require a database change (currently out of bounds):** server-side notifications (cron or Edge Function), task notifications, transactional email and preferences, in-portal client chat (may need new RLS), mobile push events.

---

## 9. The mobile app

The Expo app was removed on 2026-11-05. Mobile is being built in Flutter and must do exactly what this web app does, on the **same Supabase project**, so all web data appears there once screens exist.

Stack, structure and rules are in `apps/mobile/docs/`. Its `MEMORY.md` holds what the old app learned and the decisions still open.

**Constraints to include in any brief:** never change the database; Supabase only through a service layer; table and column names in one file; RLS is the contract; confirm every delete; feedback after every mutation; loading, empty and error states on every screen; works on small phones; semantic design tokens only.
