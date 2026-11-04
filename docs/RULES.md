# Rules — DayFlow (both apps)

Apply to web and mobile. Web conventions: [apps/web/docs/RULES.md](../apps/web/docs/RULES.md). Product: [PRD.md](./PRD.md) · Data: [DATABASE.md](./DATABASE.md) · Tokens: [theme.json](../shared/brand/theme.json).

## Non-negotiable

- **Never change the database**: no migrations, schema, RLS or data edits. Rebuilds read and write existing tables only. Exception: `scripts/migrations/038_drop_profiles_theme_preference.sql`, written at the owner's request. The owner applies it, never an agent.
- **RLS is the access contract.** Owners by `user_id` / `owner_user_id`; clients only through the portal RPCs in [DATABASE.md](./DATABASE.md). Clients write activities only with `raised_by = 'client'`.
- **Never commit** `.env`, credentials or keys. Web uses `VITE_SUPABASE_*`, mobile uses `EXPO_PUBLIC_SUPABASE_*`.
- **Auth redirect paths stay exactly as listed** in [ARCHITECTURE.md](../apps/web/docs/ARCHITECTURE.md#auth-redirect-paths-keep-identical), including the mobile and desktop deep links.
- **Migrations** are append-only in `scripts/migrations/`: never edit an applied one.
- **Brand copy** comes only from `shared/brand/brandManifest.json`.
- **Theme tokens** come from [theme.json](../shared/brand/theme.json). Change colours there, run `bun run theme:generate` in `apps/web`, then regenerate the logos and icons (see `apps/web/docs/DESIGN.md`).

## Working

- Smallest change that solves the problem. No speculative abstractions.
- Each app keeps its own `docs/` with TASKS and MEMORY. Update them when work lands. Create other markdown only when asked.
