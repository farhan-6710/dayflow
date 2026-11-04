# Memory — DayFlow (both apps)

Durable, project-wide context. App-specific notes live in `apps/<app>/docs/MEMORY.md`. Short facts, not narrative.

## Status

- Order of work: web first, then mobile. One step at a time, reviewed by the owner before moving on.
- The web rebuild is done ([apps/web/docs/TASKS.md](../apps/web/docs/TASKS.md)). The mobile app was under 10% complete and is being rebuilt from scratch next, with its own `apps/mobile/docs/`.

## Decisions

- **The database is never changed.** Same Supabase project for web and mobile; existing data must keep working.
- Client portal: clients never own projects; access via RPCs and RLS only.
- `project_for`: `null` = personal, UUID = client project. `raised_by`: `workspace` | `client`. Projects use `is_active`, never archive.
- Brand copy is only in `shared/brand/brandManifest.json`.
- Theme is not stored per user. Each app follows the device and remembers a manual choice locally. Migration 038 drops `profiles.theme_preference` and first redefines `handle_new_user()`, which inserted that column. The owner applies it, only after the new web build is live (the deployed old build still selects the column). Never applied by an agent.
- Stored times are display text such as "10:00 AM". Keep that format so web and mobile agree.
- Sign-out uses `scope: "local"`, so signing out never ends other sessions on the shared demo account.

## Ops

- Hosting: Hostinger (web). Migrations stay append-only in `scripts/migrations/`; none are planned.
- Do not commit `.env` or credentials.

## Docs

| Where | What |
|-------|------|
| `docs/PRD.md` | Goal, users, scope, success criteria |
| `docs/DATABASE.md` | Data model, client portal RPCs, DB contract |
| `docs/RULES.md` | Rules for every app |
| `shared/theme/theme.css` | Theme tokens for web and mobile (not a doc: apps import it) |
| `apps/web/docs/` | Web spec, architecture, design, rules, plan, tasks, memory |
| `apps/mobile/docs/` | Created when the mobile rebuild starts |
