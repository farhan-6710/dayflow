# Rules — DayFlow

Rules for developers and AI agents. Product: [PRD.md](./PRD.md) · Structure: [ARCHITECTURE.md](./ARCHITECTURE.md).

## Product context

- Freelancer workspace (see `brandManifest.json`); clients use a separate portal linked by email
- Two portals, one web codebase: `features/workspace/` + `features/client/`
- Live Supabase — end users do not run migrations
- Platforms: `apps/web` (Vite + Tauri), `apps/mobile` (Expo)

## Directory rules

```text
apps/web/src/services/            ALL web/desktop Supabase calls
apps/web/src/features/workspace/  Owner app (/workspace)
apps/web/src/features/client/     Client portal (/client-portal)
apps/web/src/shared/              Cross-portal UI, brand, utils
apps/web/src-tauri/               Tauri shell (not watched by Vite)
apps/mobile/                      Expo — same Supabase project
scripts/migrations/               Shared SQL (append-only)
docs/                             PRD, ARCHITECTURE, DESIGN, RULES, TASKS, MEMORY
```

Feature folders: `components/`, `hooks/`, `pages/`, `constants/`, `types/`, `utils/`.

## Code rules

- Smallest change that solves the problem
- No Supabase imports in features — only via `services/`
- Table/column names only in each app’s `db.ts`
- RLS is law (`user_id` / `owner_user_id`; client portal RPCs)
- Presentational components ~120 lines; logic in hooks
- Prop types in `types/components.ts` as `ComponentNameProps`
- `showToast` after mutations; `ConfirmationModal` before deletes
- Do not commit `.env` or credentials
- Do not create markdown unless asked
- Brand copy changes go through `brandManifest.json` first, then docs/banners

### Client portal checklist

1. `project_for` points at the client
2. Client `email` matches portal login
3. Use `fetch_client_portal_projects()` from the client session
4. Activities: respect `raised_by` and `forClientPortal`

OK to reuse presentational workspace blocks with portal props. Do not import owner-only hooks that assume `user.id` owns projects.

## Migrations & seeds

- New SQL only as the next numbered file under `scripts/migrations/`
- Never edit applied migrations
- Seeds (local): `bun run seed:clients` / `seed:client-projects` with `SEED_EMAIL` / `SEED_PASSWORD` in `apps/web/.env`

## Desktop (Tauri)

| Command | Purpose |
|---------|---------|
| `bun run tauri:dev` | Dev desktop (Vite :5173) |
| `bun run tauri:build` | macOS `.app` + `.dmg` |

Detect desktop: `isDesktopApp()` from `@/shared/utils/platform`. Eject mounted DayFlow DMG before build (`hdiutil detach "/Volumes/DayFlow"`). Do not commit `src-tauri/target/`.
