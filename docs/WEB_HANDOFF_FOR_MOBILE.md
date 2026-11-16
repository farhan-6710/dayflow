# Web → mobile handoff

Short pointer for planning Flutter against the finished web product. Canonical detail lives in the linked docs — do not duplicate it here.

## Product

DayFlow is a freelancer workspace with two users: **owner** (`/workspace`) and **client** (`/client-portal`). Same Supabase project for web, desktop and mobile. **Do not change the database.** See [PRD.md](./PRD.md) and [DATABASE.md](./DATABASE.md).

## What web already ships

| Area | Where |
|------|--------|
| Stack, folders, auth redirects, deploy, Tauri, Tempo | [apps/web/docs/ARCHITECTURE.md](../apps/web/docs/ARCHITECTURE.md) |
| UI rules, shell, lists, calendar, motion | [apps/web/docs/DESIGN.md](../apps/web/docs/DESIGN.md) |
| Code conventions | [apps/web/docs/RULES.md](../apps/web/docs/RULES.md) |
| What’s done / left on web | [apps/web/docs/TASKS.md](../apps/web/docs/TASKS.md) |

**Owner screens:** dashboard, tasks calendar, projects + notes, clients + chat, activities, reminders, notifications, analytics, settings, assistant.

**Client screens:** dashboard, shared projects, raise activities, notifications, analytics, settings.

**Also:** public marketing site; desktop shell (Tauri) reusing the web build.

## Mobile plan

- Milestone 1: UI only, sample data — [apps/mobile/docs/TASKS.md](../apps/mobile/docs/TASKS.md) and [DayFlow_Flutter_UI_Plan.md](../apps/mobile/docs/DayFlow_Flutter_UI_Plan.md).
- Milestone 2: connect the same Supabase project; mirror web auth and RLS rules.
- Brand: `shared/brand/brandManifest.json` and `shared/brand/theme.json`.

## Hard rules for mobile

1. No schema / RLS changes from the app.
2. Clients never own projects; use the portal RPCs in [DATABASE.md](./DATABASE.md).
3. Keep time strings as display text (`"10:00 AM"`).
4. Shared rules: [RULES.md](./RULES.md).
