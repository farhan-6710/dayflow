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

## Asset requirements: icons and illustrations

UI icons (nav, buttons, inputs) come from lucide-react. The custom assets below are only for stat cards, empty states and hero spots. All of them are transparent-background PNGs with one version per theme: each file name below takes a `-light` or `-dark` suffix (e.g. `icon-stat-pending-light.png`). Pick the version from the active theme.

### 3D icons (19 assets, each 512×512)

| # | File | Used in |
|---|------|---------|
| 1 | `icon-stat-pending.png` | Dashboard: pending tasks |
| 2 | `icon-stat-overdue.png` | Dashboard: overdue tasks |
| 3 | `icon-stat-projects.png` | Dashboard and client dashboard: projects |
| 4 | `icon-stat-completed.png` | Dashboard, analytics and client dashboard: completed |
| 5 | `icon-stat-tasks.png` | Analytics: total tasks |
| 6 | `icon-stat-rate.png` | Analytics: completion rate |
| 7 | `icon-stat-notes.png` | Analytics: total notes |
| 8 | `icon-stat-meetings.png` | Client dashboard: meetings |
| 9 | `icon-stat-calls.png` | Client dashboard: calls |
| 10 | `icon-empty-tasks.png` | Empty: tasks calendar day |
| 11 | `icon-empty-projects.png` | Empty: projects |
| 12 | `icon-empty-notes.png` | Empty: notes |
| 13 | `icon-empty-clients.png` | Empty: clients |
| 14 | `icon-empty-reminders.png` | Empty: reminders |
| 15 | `icon-empty-notifications.png` | Empty: notifications (both portals) |
| 16 | `icon-empty-activities.png` | Empty: client activities |
| 17 | `icon-empty-todos.png` | Empty: dashboard todo list |
| 18 | `icon-empty-links.png` | Empty: reference links |
| 19 | `icon-empty-search.png` | Empty: no search results |

### Illustrations (7 assets, about 1200px wide)

| # | File | Used in |
|---|------|---------|
| 1 | `illo-auth-workspace.png` | Workspace auth brand panel |
| 2 | `illo-auth-client.png` | Client portal auth brand panel |
| 3 | `illo-sidebar-workspace.png` | Workspace sidebar quick-action card |
| 4 | `illo-sidebar-client.png` | Client sidebar quick-action card |
| 5 | `illo-dashboard-hero.png` | Dashboard greeting / hero corner |
| 6 | `illo-not-a-client.png` | `/client-portal/not-a-client` |
| 7 | `illo-error.png` | Route error and not-found page |

### Where files go

| What | Folder |
|------|--------|
| Generated sheets (source, not shipped) | `apps/web/design/sheets/` as `icons-sheet-{light,dark}.png` and `illustrations-sheet-{light,dark}.png` |
| PNG masters, sliced from the sheets (not shipped) | `apps/web/design/images/{icons,illustrations}/` |
| Shipped icons: 256px WebP made from the masters | `apps/web/public/images/dayflow/icons/` |
| Shipped illustrations: 800px WebP made from the masters | `apps/web/public/images/dayflow/illustrations/` |
| Paths in code | `shared/constants/dayflowImages.ts` only (e.g. `/images/dayflow/icons/icon-stat-pending-light.webp`) |

The sheets are sliced into the named files in the order of the tables above: left to right, top to bottom. Done for both themes. The sheets also produced one extra icon, `icon-extra-sparkles-{light,dark}.png`, not assigned to a screen yet.

### Prompt: icon sheet

```text
Create one PNG sheet with a fully transparent background (no backdrop, no shadow plate).
Show 19 playful glossy 3D icons in a grid of 5 columns and 4 rows, left to right, top to bottom,
evenly spaced, each centred in its own square cell, nothing overlapping, no text or labels.
Style: soft rounded clay-like 3D, gentle top-left light, subtle soft shadow under each object only.
Palette: warm cream and paper beige, charcoal grey, with coral orange (#E2704A) as the single accent.
Must read well on both a light cream and a near-black background.
Icons in order:
1 hourglass (pending), 2 alarm clock with alert badge (overdue), 3 folder stack (projects),
4 check-mark badge (completed), 5 checklist clipboard (tasks), 6 rising progress ring (completion rate),
7 notebook with pen (notes), 8 calendar with two people (meetings), 9 phone handset (calls),
10 empty calendar page (no tasks), 11 empty open folder (no projects), 12 blank sticky note (no notes),
13 empty business card holder (no clients), 14 bell with clock (no reminders), 15 quiet sleeping bell (no notifications),
16 empty activity tray (no activities), 17 blank to-do card (no todos), 18 broken chain link (no links),
19 magnifying glass with nothing found (no search results). Leave the 20th cell empty.
```

### Prompt: illustration sheet

```text
Create one PNG sheet with a fully transparent background (no backdrop, no ground plane).
Show 7 playful 3D illustrations side by side in a grid of 4 columns and 2 rows, left to right, top to bottom,
evenly spaced, each in its own wide landscape cell, nothing overlapping, no text or labels.
Style: same soft rounded clay-like 3D as a matching icon set, gentle top-left light, subtle soft shadows.
Palette: warm cream and paper beige, charcoal grey, coral orange (#E2704A) as the single accent.
Must read well on both a light cream and a near-black background.
Illustrations in order:
1 a freelancer's desk with laptop, calendar and coffee (workspace sign-in),
2 two people exchanging a project folder across a desk (client portal sign-in),
3 a small plant growing from a calendar (workspace sidebar card),
4 a folder with a progress bar and a speech bubble (client sidebar card),
5 a sunrise over a neat stack of task cards (dashboard hero),
6 a locked door with a friendly key tag (not a client),
7 a tangled path with a signpost (error / page not found). Leave the 8th cell empty.
```

## 1. Foundation
- Vite + React 19 + TS in `apps/web` (keep `.env`).
- Tailwind 4, `shadcn init` (alias `@/`, ui in `shared/ui`), then apply `docs/theme.css`. Fonts: Ovo + Merriweather.
- Deps: react-router 7, @supabase/supabase-js, framer-motion, @aejkatappaja/phantom-ui, recharts, @dnd-kit, date-fns, sonner, next-themes, lucide-react.
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
  - `EmptyState`, `ErrorBanner`, `Phantom` + `TableSkeleton` + `PageSkeleton`, `Reveal`
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
- **Components:** `RemindersWeekTable`, `ReminderDialog` (time, day toggles, disable / disable-until).
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
