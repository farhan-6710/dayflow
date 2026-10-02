# PRD — DayFlow

## Product

**DayFlow** — Organize your day. Elevate your flow.

A workspace built for freelancers to manage clients, projects, tasks, meetings, notes, reminders, and more — all in one place.

Brand copy source of truth: `apps/web/src/shared/brand/brandManifest.json`.

## Goals

- One freelancer workspace for clients, projects, tasks, meetings, notes, and reminders
- Separate client portal so clients can follow shared work and raise activities
- Same account and data across web, desktop (macOS/Windows), and mobile

## Users

| User | Access | Needs |
|------|--------|--------|
| Workspace owner | `/workspace` · desktop · mobile | Run client work, personal tasks, and daily operations |
| Client | `/client-portal` | View shared projects; raise tasks, meetings, and calls |

## Surfaces

| Surface | Scope today |
|---------|-------------|
| Web + desktop | Full workspace + client portal |
| Mobile | Owner reminders + push (same Supabase user) |

## Requirements

- Auth: email/password; Google OAuth on web/desktop
- Workspace: dashboard, tasks/calendar, projects, clients, notes, reminders, notifications, analytics
- Projects: personal (`project_for` null) or client-linked; active/inactive
- Client portal: email linked to a client record; shared projects; raise activities (`raised_by = 'client'`)
- Activities: tasks, meetings, calls with date/time, priority, status
- Notes: categories + optional reference links
- Reminders: occurrences + Expo push on mobile
- RLS: owners by `user_id` / `owner_user_id`; clients via portal RPCs only

## Expected outcomes

- Owner plans the day and manages client work in one place
- Client stays aligned on shared work without owning projects
- Web, desktop, and mobile share one backend and one source of truth

## Portal feature groups

See `brandManifest.json` → `portals.workspace.features` and `portals.client.features`.
