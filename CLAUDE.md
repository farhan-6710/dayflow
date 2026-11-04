# DayFlow

Freelancer workspace on one Supabase project: a web app (`apps/web`, rebuilt) and a mobile app (`apps/mobile`, rebuilt). The database must never change.

This file holds what applies to every app. Each app has its own `docs/`, loaded by the `CLAUDE.md` inside that app's folder (`apps/web/CLAUDE.md`, and `apps/mobile/CLAUDE.md` once mobile starts). When docs conflict, RULES wins.

## Shared rules
@docs/RULES.md

## Product and data
@docs/PRD.md
@docs/DATABASE.md
@docs/MEMORY.md

Theme tokens: `shared/brand/theme.json` (edit it when changing colours, radius or shadows, then run `bun run theme:generate` in `apps/web`).

## App docs

| App | Docs | Loaded by |
|-----|------|-----------|
| Web | `apps/web/docs/` | `apps/web/CLAUDE.md` |
| Mobile | `apps/mobile/docs/` | `apps/mobile/CLAUDE.md` |

Working in an app folder loads that app's docs. When working from the repo root, read `apps/<app>/CLAUDE.md` first.
