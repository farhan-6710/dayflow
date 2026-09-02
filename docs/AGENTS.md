# Agent Guidelines — DayFlow

Rules for developers and AI agents. See [README.md](./README.md) for product overview and [DESIGN.md](./DESIGN.md) for architecture.

---

## Product context

- **Single-owner, multi-client** — one workspace owner; clients get separate auth linked by email
- **Two portals, one codebase** — `features/workspace/` + `features/client/`; share via `shared/` and `client-activities`
- **Live product** — hosted Supabase; end users do not run migrations
- **Platforms** — web (Vite), desktop (Tauri), mobile (Expo, separate repo)

---

## Directory rules

```text
src/services/           ALL Supabase calls — never import supabaseClient in features
src/features/workspace/   Owner app (/workspace)
src/features/client/      Client portal (/client-portal)
src/shared/               Cross-portal UI, layouts, utils
src-tauri/                Tauri config, Rust shell, icons (do not watch in Vite)
```

Feature folders: `components/`, `hooks/`, `pages/`, `constants/`, `types/`, `utils/`.

---

## Code rules

- Smallest change that solves the problem — no over-engineering
- Supabase only in `src/services/`; table/column names only in `src/services/db.ts`
- RLS is law — workspace uses `user_id` / `owner_user_id`; client portal uses RPCs (022–026)
- Presentational components ~120 lines; logic in hooks
- Prop types in `types/components.ts` as `ComponentNameProps`
- `showToast` after mutations; `ConfirmationModal` before deletes
- Do not commit `.env` or credentials
- Do not create markdown files unless asked

### Client portal checklist

1. `project_for` must point to the client
2. Client `email` must match portal login
3. Use `fetch_client_portal_projects()` from client session
4. Activities: respect `raised_by` and `forClientPortal` on `useClientActivitiesQuery`

### Reusing workspace UI in client portal

OK for presentational blocks with props (`ClientActivitiesBlock`, `forClientPortal`, `activityRaisedBy="client"`). Do not import workspace-only hooks that assume `user.id` owns projects.

---

## Tauri (desktop)

| Command | Purpose |
|---------|---------|
| `bun run tauri:dev` | Dev desktop window (starts Vite on :5173) |
| `bun run tauri:build` | macOS `.app` + `.dmg` |
| `bunx tauri icon public/logo-light-icon.png` | Regenerate icons |

Config: `src-tauri/tauri.conf.json` · Vite ignores `src-tauri/` in watch · CSP allows Supabase domains.

Detect desktop in React: `isDesktopApp()` from `@/shared/utils/platform`.

**Desktop Google OAuth:** system browser → hosted bridge `/auth/desktop-oauth-bridge` → deep link `dayflow://auth/callback` → `exchangeCodeForSession`. Requires PKCE (`supabaseClient`), Tauri plugins `opener` + `deep-link`, and Supabase redirect URL for the bridge page.

---

## GitHub Release (maintainer)

1. Bump `version` in `src-tauri/tauri.conf.json` + `src-tauri/Cargo.toml`
2. `bun run tauri:build`
3. GitHub → Releases → tag `vX.Y.Z` on `main`
4. Upload `src-tauri/target/release/bundle/dmg/*.dmg`
5. Note in release: macOS may need right-click → Open for unsigned builds

Do not commit `src-tauri/target/`.

---

## Migrations (contributors only)

New SQL only under `scripts/migrations/` — never edit applied migrations. Production DB is already migrated; see `DESIGN.md` for schema.

## Seeds (local dev only)

`bun run seed:clients` · `seed:client-projects` · requires `SEED_EMAIL` / `SEED_PASSWORD` in `.env`
