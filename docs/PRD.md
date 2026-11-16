# PRD — DayFlow

**Organize your day. Elevate your flow.**

A workspace for freelancers to run clients, projects, tasks, notes, reminders and client requests in one place. One Supabase project serves web, desktop and mobile.

## Users

| User | Entry | Needs |
|------|-------|-------|
| Workspace owner | `/workspace` (web / desktop) | Run client work, personal tasks and daily ops |
| Client | `/client-portal` | Follow shared projects; raise tasks, meetings and calls |

## Platforms

| Surface | Status |
|---------|--------|
| Web (`apps/web`) | Shipped — workspace, client portal, public site |
| Desktop (Tauri in `apps/web/src-tauri`) | Shipped builds — [releases](https://github.com/farhan-6710/dayflow/releases) |
| Mobile (`apps/mobile`, Flutter) | UI milestone with sample data; database comes later |

## Requirements

**Shared**

- One database, untouched by app work. Existing accounts and data keep working.
- Google OAuth and email/password auth. Desktop returns via `dayflow://`.
- Brand copy only from `shared/brand/brandManifest.json`. Theme tokens only from `shared/brand/theme.json`.

**Workspace**

- Dashboard, tasks calendar, projects and notes, clients (with chat), client activities, reminders, notifications, analytics, settings, Tempo assistant.
- Light and dark theme, responsive layouts, loading / empty / error states, confirmed deletes, mutation toasts.

**Client portal**

- Dashboard, shared projects, raise activities, notifications, analytics, settings.
- Clients never own projects; access only through portal RPCs and RLS.

**Public site**

- Marketing pages at `/`, `/features`, `/how-it-works`, `/about`, `/contact`.

## Out of scope (for now)

- Changing schema, RLS or migrations from app work (owner applies SQL by hand when needed).
- Server-side reminder / task notification jobs and transactional product email.
- Mobile push and live Supabase on Flutter (after the UI milestone).

## Success

- Web and desktop match the product above against real data.
- Client portal works with a real client login.
- Mobile UI matches the showcase; then connects to the same Supabase project.

## Docs

[DATABASE.md](./DATABASE.md) · [RULES.md](./RULES.md) · [MEMORY.md](./MEMORY.md) · [Web architecture](../apps/web/docs/ARCHITECTURE.md) · [Web tasks](../apps/web/docs/TASKS.md) · [Mobile tasks](../apps/mobile/docs/TASKS.md)
