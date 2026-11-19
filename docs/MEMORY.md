# Memory — DayFlow (shared)

Short durable facts for every app. App detail: [web MEMORY](../apps/web/docs/MEMORY.md) · [mobile MEMORY](../apps/mobile/docs/MEMORY.md).

## Status

- Web and desktop are shipped. Remaining owner checks: live deploy redirects, real client login, desktop Google sign-in on an installed build — see [web TASKS](../apps/web/docs/TASKS.md).
- Mobile is Flutter, UI-only with sample data first; Supabase later — see [mobile TASKS](../apps/mobile/docs/TASKS.md). Expo was removed 2026-11-05.

## Decisions

- One Supabase project for all surfaces. Apps do not change the database.
- `project_for`: `null` = personal, UUID = client. `raised_by`: `workspace` \| `client`. Projects use `is_active`, not archive.
- Theme is not stored per user. Device default + local choice. `user_settings` holds on/off prefs such as `page_transitions` (migration 040).
- Stored times are display text like `"10:00 AM"` so web and mobile agree.
- Sign-out uses `scope: "local"` so the shared demo account is not signed out everywhere.

## Ops

- Web: https://dayflow-web-version.vercel.app (Vercel, redeploys on push). Desktop: [GitHub Releases](https://github.com/farhan-6710/dayflow/releases).
- Do not commit `.env` or secrets.
