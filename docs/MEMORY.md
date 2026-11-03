# Memory — DayFlow

Durable context for future sessions. Short facts, not narrative.

## Status

- 2026-11-04: old `apps/web` wiped from the repo (commit `0e42896`); full rebuild starts from scratch. Last commit that still has the old code: `b1335f3`. `apps/web/.env` was preserved.
- Order of work: web first, then mobile. One step at a time, reviewed by the owner before moving on.

## Decisions

- **The database is never changed.** Same Supabase project for web and mobile; existing data must keep working.
- Routes and features are fixed by [WEB_REBUILD_SPEC.md](./WEB_REBUILD_SPEC.md): `/workspace` (8 nav items) and `/client-portal` (5 nav items) in one shared shell layout.
- Look and feel: [theme.css](./theme.css) (warm paper neutrals, charcoal primary, Ovo + Merriweather, 0.5rem radius). It replaces the old gold/Trail theme.
- Client portal: clients never own projects; access via RPCs and RLS only.
- `project_for`: `null` = personal, UUID = client project. `raised_by`: `workspace` | `client`. Projects use `is_active`, never archive.
- Brand copy is only in `shared/brand/brandManifest.json`.

## Known gaps in the old app (fix in the rebuild where the DB allows)

- Reminder notifications only fire while the reminders page is open (browser timer).
- Task notifications were never created; no product emails beyond Supabase auth mail.
- Client portal: empty notifications, analytics and settings reused owner pages, no chat.
- Dashboard "Weekly insights" and "Activity snapshot" were placeholders.

## Rebuild notes

- Reminder alerts are created in the browser by `useReminderAlerts` across the whole workspace, while a tab is open. There is still no server job.
- The completion chart counts done tasks by `updated_at` because `tasks` has no completed-at column, so editing or reordering an old done task moves it in the chart.
- Stored times are display text such as "10:00 AM" (see `shared/constants/times.ts`). Keep that format for mobile compatibility.

## Ops

- Shipped images are WebP; PNG masters and logos live in `apps/web/design/` and are not deployed. Regenerate WebP from them with `cwebp` if art changes.

- Hosting: Hostinger. Desktop (Tauri) is out of scope until the web rebuild ships.
- Migrations stay append-only in `scripts/migrations/`; none are planned.
- Do not commit `.env` or credentials.

## Docs

| File | Role |
|------|------|
| `PRD.md` | Goal, users, scope, success criteria |
| `WEB_REBUILD_SPEC.md` | Routes, nav, features, notifications |
| `WEB_ENV_AND_LINKS.md` | Env vars, links, auth redirects, DB contract |
| `ARCHITECTURE.md` | Stack, folders, data flow, data model |
| `DESIGN.md` + `theme.css` | UI direction and theme tokens |
| `RULES.md` | Conventions for developers and agents |
| `IMPLEMENTATION_PLAN.md` | Per-route data and components, build order |
| `TASKS.md` | Phased rebuild checklist |
| `MEMORY.md` | This file |

Read order for a new agent: PRD → WEB_REBUILD_SPEC → ARCHITECTURE → RULES → DESIGN → IMPLEMENTATION_PLAN → TASKS.
