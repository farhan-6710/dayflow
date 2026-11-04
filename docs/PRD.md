# PRD — DayFlow

**Organize your day. Elevate your flow.**
A workspace built for freelancers to manage clients, projects, tasks, meetings, notes, reminders, and more — all in one place.

## Goal

Rebuild the DayFlow web app from scratch (mobile after) with better UI/UX, keeping every existing feature and the **existing Supabase database untouched**, so current data keeps working.

## Users

| User | Entry | Needs |
|------|-------|-------|
| Workspace owner (freelancer) | `/workspace` | Run client work, personal tasks and daily operations |
| Client | `/client-portal` | Follow shared projects; raise tasks, meetings and calls |

## Scope

| In | Out (for now) |
|----|---------------|
| All routes and features of the old app, rebuilt in `apps/web/src/app/router.tsx` | Desktop (Tauri) |
| Light + dark theme, responsive layouts | Any database, schema or RLS change |
| Existing Google OAuth + email/password auth | Server-side notifications and email (needs a backend decision, see [TASKS.md](../apps/web/docs/TASKS.md)) |

## Requirements

- Two portals in one codebase, sharing one shell layout (header, left sidebar, main content).
- Owner features: dashboard, tasks calendar, projects and notes, clients, client activities and chat, daily reminders, notifications, analytics, settings.
- Client features: dashboard, shared projects, raise activities, notifications, analytics, settings.
- Every list and detail screen has loading, empty and error states.
- Deletes are always confirmed; mutations always give feedback.

## Success criteria

- Feature parity with the old web app, verified page by page against the spec.
- Existing accounts and data load with no migration.
- Both portals work on phone, tablet and desktop widths.
- The same Supabase project keeps serving web and mobile.

## References

[ARCHITECTURE.md](../apps/web/docs/ARCHITECTURE.md) web structure, env, redirects, deploy · [DATABASE.md](./DATABASE.md) data contract
