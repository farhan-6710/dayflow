# DayFlow Web — Implementation Plan

## Guest account

Use this account to sign in to the app as a guest (demo login) and to check the current state of the database when needed:

```env
EMAIL=dayflow.demo@gmail.com
PASSWORD=D@1234
```

Use it read-mostly: never change the schema or delete real data while checking.

## Context
`apps/web` was wiped (only `.env` remains) so DayFlow can be rebuilt from scratch with better UI/UX. The build must:
- reuse the existing Supabase database unchanged;
- follow `docs/` (RULES, ARCHITECTURE, DESIGN, `theme.css`, WEB_REBUILD_SPEC).

This plan lists every route, the data it shows and the components it needs, in build order.

## How to work
- **`/caveman`**: turn on at the start of each session. It gives terse answers and lean builds: smallest complete change, no speculative code.
- **`/impeccable`**: use for every screen.
  - Before a page: shape its layout and hierarchy.
  - After a page: run critique and polish (responsive, both themes, states, a11y).
  - At the end: capture the design system.
- Build one page at a time, in this order for each page: service → hook → page → loading / empty / error states → check in the browser → tick it off in `docs/TASKS.md`.

## 1. Foundation
- Vite + React 19 + TS in `apps/web` (keep `.env`).
- Tailwind 4, `shadcn init` (alias `@/`, ui in `shared/ui`), then apply `docs/theme.css`. Fonts: Ovo + Merriweather.
- Deps: react-router 7, @supabase/supabase-js, framer-motion, recharts, @dnd-kit, date-fns, sonner, next-themes, lucide-react.
- `services/supabaseClient.ts` + `services/db.ts`. Columns come from the old `db.ts` in git at `b1335f3`.
- `@dayflow/brand` alias pointing at `shared/brand`. Restore logos and favicons from git.

## 2. Shell and shared pieces
- **Providers:** Auth, Theme, Toaster, Tooltip, UnsavedChanges, PageTransition.
- **Router:** lazy pages, route constants, guards (`PublicRoute`, `ProtectedRoute`, `ClientPublicRoute`, `ClientProtectedRoute`), `RouteErrorPage`, legacy redirects.
- **`AppShellLayout`:**
  - Header: collapse toggle, page search, theme toggle, actions, user menu.
  - Sidebar: brand, nav, quick-action card, profile row. Becomes a mobile sheet on small screens.
  - Main outlet.
- **Shared components:**
  - `PageHeader`, `StatCard` / `StatsCards`, `DirectoryTable`
  - `ListingSearchInput`, `ActiveStatusFilter`, `DateFilters` / `DateRangePicker`, `DatePicker`
  - `EmptyState`, `ErrorBanner`, skeletons
  - `ConfirmationModal`, `showToast`, `StatusPill`, `UserAvatar`

## 3. Routes: data and components

### Shared
| Route | Data | Components |
|-------|------|------------|
| `/` and unknown paths | session | Redirect to the right portal |
| `/auth/oauth-callback` | OAuth code | Callback handler, which then redirects to `next` |
| `/auth/desktop-oauth-bridge` | OAuth code | Minimal bridge page. Kept because Supabase allow-lists this URL. |

### Workspace (`/workspace`)

**`/auth`**
- **Data:** auth (`authService`).
- **Components:** `AuthShell` (brand panel from the manifest), Login, Signup, Forgot password, Reset password, Google button, demo login.

**`/dashboard`**
- **Data:** profile, plus tasks, todos and projects filtered by the date range.
- **Components:**
  - Greeting header + `DateFilters`
  - 4 `StatCards`: pending, overdue, projects, completed
  - `TaskCompletionChart`: month vs month
  - `TodoList`: sortable, `TodoFormDialog`
  - `TimeTracker`
  - Weekly insights and Activity snapshot cards, derived from tasks and activities

**`/tasks-calendar`**
- **Data:** tasks.
- **Components:** `MonthBar`, `WeeksGrid` with day cells, `DayPanel` with sortable task items, `TaskFormDialog` (title, description, priority, due date and time, status), `StatusLegend`.

**`/projects-management`**
- **Data:** projects (+ client name), clients for the "Project for" select.
- **Components:** search, active filter, sortable `ProjectsTable` (cards on mobile), `ProjectFormDialog` (name, color, project for, active).

**`/projects-management/:id`**
- **Data:** project, its notes, its reference links, its activities (client projects only).
- **Components:**
  - Header actions: edit, activate / deactivate, delete
  - Project info
  - `ReferenceLinksSection` + dialog
  - `NotesTable`: search, category filter, sortable
  - `ClientActivitiesBlock`

**`/projects-management/:id/notes/:noteId`**
- **Data:** note, note reference links.
- **Components:** `NoteEditor` (title, category, body), links section, delete, unsaved-changes guard.

**`/clients-management`**
- **Data:** clients.
- **Components:** search, active filter, `ClientsTable`, `ClientDialog`. Dialog fields: company, name, mobile, email, secondary contact, website, active.

**`/clients-management/:id`**
- **Data:** client, the client's projects, activities across those projects, chat messages.
- **Components:** `ClientSummary`, `ClientProjectsSection` (+ new project prefilled with this client), `ClientActivitiesBlock`, `ClientChat`, edit, delete.

**`/daily-reminders`**
- **Data:** reminders.
- **Components:** `RemindersWeeksTable`, `ReminderDialog` (time, day toggles, disable / disable-until).
- **Behaviour:** reminder alerts are created client-side, as before. This needs no database change.

**`/notifications`**
- **Data:** the user's unread notifications.
- **Components:** Reminders table, Tasks table, mark read. Header bell badge with unread count.

**`/analytics`**
- **Data:** tasks, projects, notes.
- **Components:** 4 `StatCards`, task-status pie chart, notes-per-project bar chart.

**`/settings`**
- **Data:** profile, auth user.
- **Components:** Profile card (name, avatar), Email card (with confirmation), Password card (set password or send reset link), Theme card.

### Shared module: `ClientActivitiesBlock`
- Three tabs: tasks, meetings, calls.
- Each tab has Open / Closed sections, a project select and per-type dialogs.
- Works in both portals: `forClientPortal` and `raised_by` change who can create and edit.

### Client portal (`/client-portal`)
| Route | Data | Components |
|-------|------|------------|
| `/auth` | auth + `link_client_portal_user()` | `AuthShell`, Login, Signup, Google |
| `/not-a-client` | — | Explainer + sign out |
| `/dashboard` | client record, `fetch_client_portal_projects()`, activities | 4 `StatCards`: active projects, tasks completed, meetings completed, calls attended. Plus `ClientActivitiesBlock`. |
| `/projects` | portal projects | Search, project cards / table |
| `/projects/:id` | project + activities | Project info, `ClientActivitiesBlock` with "raise" dialogs (`raised_by = client`) |
| `/notifications` | the user's own notifications rows | Inbox list with mark read, empty state |
| `/analytics` | portal projects + activities | Client-specific stats: activities by status and type, per project |
| `/settings` | profile, auth user | Same settings cards as the workspace (shared components) |

## 4. Finish
- **Quality passes:** responsive (phone, tablet, desktop) and both themes on every page, plus an `/impeccable` audit.
- **Checks:** parity against `docs/WEB_REBUILD_SPEC.md`, then `bun run build` + lint clean.
- **Deploy:** Hostinger. Confirm the Supabase auth redirects work.

## Out of scope
Desktop (Tauri), mobile, and anything that needs a database change: server-side notifications, email, client chat in the portal, push.

## Verification
- **Per page:** run `bun run dev`.
  - Sign in with the demo account and confirm existing data loads unchanged.
  - Test create, edit and delete (toast and confirm modal both appear).
  - Test loading, empty and error states.
  - Check phone and desktop widths, in light and dark.
- **Client portal:** sign in with an email linked to a client and confirm only shared projects appear.
- **End:** run `bun run build`, then do a full click-through of every route in both portals.
