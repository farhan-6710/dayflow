# DayFlow Web: Env, Links & Paths

This file lists everything the new web app needs so it can reconnect to the existing Supabase database and auth setup.

**The database is not touched by the rebuild.** No schema changes, no migrations, no data resets.

The old web code is recoverable from git at commit `b1335f3`, under the path `apps/web/`.

---

## 1. Environment variables

These are kept in `apps/web/.env`, which is untracked and was not modified. Values are not repeated here.

| Variable | Used for |
|----------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL. Shared with desktop and mobile. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `SEED_EMAIL` | Local seed scripts only: the account the seed data is written to |
| `SEED_PASSWORD` | Local seed scripts only |
| `VITE_APP_ORIGIN` *(optional, not set)* | Public web origin for the desktop OAuth bridge. Defaults to the hosting URL below. |

Mobile uses the same project through `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. These live in `apps/mobile`, which is untouched.

---

## 2. Live links

| What | URL |
|------|-----|
| Web (hosting) | https://bisque-gull-237581.hostingersite.com |
| Workspace login | https://bisque-gull-237581.hostingersite.com/workspace/auth |
| Client portal login | https://bisque-gull-237581.hostingersite.com/client-portal/auth |
| Desktop releases | https://github.com/farhan-6710/dayflow/releases |

---

## 3. Auth redirect paths (keep identical)

The Supabase Auth dashboard has these URLs on its allow list. The new app must serve the same paths, or the allow list must be updated in Supabase.

| Path / URL | Purpose |
|------------|---------|
| `<origin>/auth/oauth-callback` | Google OAuth popup callback (both portals). Carries a `?next=` query param. |
| `<origin>/auth/desktop-oauth-bridge` | Desktop OAuth: the browser lands here, then forwards to the app |
| `dayflow://auth/callback` | Desktop deep link (Tauri scheme `dayflow`) |
| `<origin>/workspace/auth?form-type=reset-password` | Target of the password-reset email link |
| `<origin>/workspace/dashboard` | Default redirect after email confirmation or sign-in |

- `<origin>` is the hosting URL above, or `http://localhost:5173` in development.
- OAuth providers: Google is enabled. The rebuild has no Facebook button.

---

## 4. Database contract (do not change)

**Tables:**

`profiles`, `projects`, `notes`, `project_reference_links`, `note_reference_links`, `clients`, `client_conversation_messages`, `tasks`, `todos`, `reminders`, `reminder_occurrences`, `notifications`, `client_activity_tasks`, `client_activity_meetings`, `client_activity_calls`, `expo_push_tokens`

**Functions and RPCs:**

| Function | Purpose |
|----------|---------|
| `link_client_portal_user()` | Links a client-portal login to its `clients` row |
| `fetch_client_portal_projects()` | Returns the projects shared with the signed-in client |
| `client_portal_can_access_project(uuid)` | Checks client access to one project |
| `client_portal_session_email()` | Helper used by the client-portal functions |
| `client_portal_resolved_email()` | Helper used by the client-portal functions |
| `handle_new_user()` | Trigger that creates the `profiles` row |
| `handle_updated_at()` | Trigger that maintains `updated_at` |

**Where the schema lives and how it is protected:**

- Schema history: `scripts/migrations/001–037` at the repo root. Kept, and append-only.
- Exact column selects per table: in the old `apps/web/src/services/db.ts`, recoverable from git.
- RLS policies stay as they are. The new code must work within them.

---

## 5. Kept outside `apps/web` (still in repo)

| Path | What |
|------|------|
| `shared/brand/brandManifest.json` | Brand name, tagline, SEO copy, portal subtitles and features |
| `scripts/migrations/` | SQL schema history |
| `apps/mobile/` | Expo app, which uses the same Supabase project |
| `docs/WEB_REBUILD_SPEC.md` | Routes, features and rules for the rebuild |

---

## 6. Recover from git if needed (commit `b1335f3`)

| Old path | What |
|----------|------|
| `apps/web/src/features/workspace/auth/constants/demoAccount.ts` | Demo account login credentials (the account shown on the login screen) |
| `apps/web/src-tauri/` | Desktop config. Notable settings: <br>• identifier `com.dayflow.app` <br>• product name `DayFlow`, version `0.1.9` <br>• window 1280×840 (min 960×600) <br>• deep-link scheme `dayflow` <br>• CSP allowing `*.supabase.co` <br>• plugins: opener, deep-link |
| `apps/web/public/` | Logos, favicons, 3D icons and illustrations, promotion banners |
| `apps/web/scripts/` | Seed scripts and logo/favicon generators |
| `apps/web/src/services/` | Every existing Supabase query (useful as a reference) |

Restore any of these with:

```bash
git checkout b1335f3 -- <path>
```

---

## 7. Deploy notes

- `bun run build` in `apps/web` writes `dist/`. Upload its contents, including `.htaccess`, to the Hostinger site root.
- `.htaccess` sends every route to `index.html`, so deep links and refreshes work on Apache.
- Env vars are baked in at build time, so build with `apps/web/.env` present.
- The desktop bridge page stays live because released desktop builds use it.
