# DayFlow

Freelancer workspace on one Supabase project: web (`apps/web`), desktop (Tauri inside web), and mobile (`apps/mobile`, Flutter — UI-only milestone). Apps must not change the database.

Shared context is here. Each app has its own `docs/`, loaded by that app’s `CLAUDE.md`. When docs conflict, [docs/RULES.md](./docs/RULES.md) wins.

## Shared

@docs/RULES.md
@docs/PRD.md
@docs/DATABASE.md
@docs/MEMORY.md

Theme tokens: `shared/brand/theme.json` — edit colours there, then `bun run theme:generate` in `apps/web`.

## App docs

| App | Docs | Loaded by |
|-----|------|-----------|
| Web | `apps/web/docs/` | `apps/web/CLAUDE.md` |
| Mobile | `apps/mobile/docs/` | `apps/mobile/CLAUDE.md` |

Working in an app folder loads that app’s docs. From the repo root, read `apps/<app>/CLAUDE.md` first.
