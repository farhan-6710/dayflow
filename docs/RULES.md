# Rules — DayFlow (every app)

Web conventions: [web RULES](./web/RULES.md). Product: [PRD.md](./PRD.md). Data: [DATABASE.md](./DATABASE.md). Tokens: [theme.json](../shared/brand/theme.json).

## Non-negotiable

- **Never change the database** from app work: no schema, RLS or data edits. Exceptions are SQL the owner asked for and applies by hand (see [DATABASE.md](./DATABASE.md)).
- **RLS is the access contract.** Owners by `user_id` / `owner_user_id`; clients only through the portal RPCs in [DATABASE.md](./DATABASE.md). Clients write activities only with `raised_by = 'client'`.
- **Never commit** `.env`, credentials or keys.
- **Auth redirect paths** stay exactly as listed in [ARCHITECTURE.md](web/ARCHITECTURE.md#auth-redirect-paths).
- **Migrations** are append-only under `scripts/migrations/`.
- **Brand copy** only from `shared/brand/brandManifest.json`, read in code via `brandManifest.ts` (web) or the generated `brand_manifest.dart` (mobile). Never type a brand name, tagline or portal name into code.
- **Theme tokens** only from [theme.json](../shared/brand/theme.json). After colour changes: `bun run theme:generate` in `apps/web`, then regenerate logos/icons (see [DESIGN.md](web/DESIGN.md)).

## Working

- Smallest change that solves the problem.
- Each app keeps its docs in `docs/web/` or `docs/mobile/` (`TASKS`, `MEMORY`). Update them when work lands. Create other markdown only when asked.
