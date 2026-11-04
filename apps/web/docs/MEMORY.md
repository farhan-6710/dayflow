# Memory — DayFlow Web

Durable context for the web app. Project-wide decisions (database, order of work, hosting) are in [docs/MEMORY.md](../../../docs/MEMORY.md). Short facts, not narrative.

## Status

- 2026-11-04: old `apps/web` wiped from the repo (commit `0e42896`); full rebuild starts from scratch. Last commit that still has the old code: `b1335f3`. `apps/web/.env` was preserved.
- The web rebuild is complete apart from the owner-only items in [TASKS.md](./TASKS.md).

## Decisions

- Routes live in `src/app/router.tsx`: `/workspace` (8 nav items) and `/client-portal` (5 nav items) in one shared shell layout.
- Look and feel: [theme.json](../../../shared/brand/theme.json) (warm paper neutrals, charcoal primary, Ovo UI, Young Serif headings, Merriweather notes). It replaces the old gold/Trail theme.

## Known gaps in the old app (fix in the rebuild where the DB allows)

- Reminder notifications only fire while the reminders page is open (browser timer).
- Task notifications were never created; no product emails beyond Supabase auth mail.
- Client portal: empty notifications, analytics and settings reused owner pages, no chat.
- Dashboard "Weekly insights" and "Activity snapshot" were placeholders.

## Rebuild notes

- Reminder alerts are created in the browser by `useReminderAlerts` across the whole workspace, while a tab is open. There is still no server job.
- The completion chart counts done tasks by `updated_at` because `tasks` has no completed-at column, so editing or reordering an old done task moves it in the chart.
- Stored times are display text such as "10:00 AM" (see `shared/constants/times.ts`). Keep that format for mobile compatibility.

- Trail itself has no framer-motion: it uses CSS keyframes and `src/lib/entrance-motion.ts`. `Reveal` and `entranceMotion.ts` port its timings and scheduling to framer-motion, with blur added to `enter` (Trail blurs only `hero`) at the owner's request. Content triggers at 10% from the viewport bottom rather than Trail's 20%, so short items at the end of a page can't get stuck hidden.
- A shared route-level `PageSkeleton` was removed: it flashed a wrong-shaped skeleton before each page's own on every route. Shell routes have no `Suspense` of their own, so they suspend to `PageOutlet` and the router's transition keeps the old page up.
- Demo login: a green `DemoLoginButton` under Google, plus `DemoAccountCard`, absolutely positioned at the top right and sliding in on the X axis after 1 second so the form never moves. It is dismissible where it overlaps. It has its own slide rather than `Reveal` because the owner specified this entrance. The credentials stay visible on purpose: the account is public and they also work in the mobile app.
- Testing motion: a hidden Browser pane stops `requestAnimationFrame`, so `Reveal` elements read as `opacity: 0`. Show the pane first.
- Reminders moved from seven day cards to one row per reminder, so the per-day add buttons are gone. New reminders default to today, and the dialog sets the days.

- The clients and projects redesign followed the owner's reference screenshots, except where the database has no backing data: no "On Hold" or "Completed" project status (only `is_active`), no bulk checkboxes, no rich text toolbar (notes are plain text shared with mobile), no note Activity or History tabs, no percentage trends (only "+N new" this month). Project and note rows keep drag handles, so only the clients table has sortable columns.
- The calendar follows the Deccan Dentics admin calendar (`/Users/farhan/my-learnings/deccan-dentics-dental-clinic`, `components/admin/calendar`), adapted for tasks: no duration (60 minutes assumed), optional time ("No time" row), overlaps share width, and week headers inside the scroller, which Deccan keeps outside and so misaligns on phones.
- Sign-out uses `scope: "local"`. The default global scope ended every session on the shared demo account whenever anyone signed out.
- Theme is not stored per user. It defaults to the device (`defaultTheme="system"`), and the toggle's choice is remembered by next-themes in `localStorage` under `DF-theme` (which holds `"system"` until the owner picks). A saved profile theme made a light-mode sign-in switch to dark, so it was removed. `main.tsx` sets the class before first paint because next-themes' own script is inert here.
- Migration 038 (see the shared memory) drops `profiles.theme_preference` and first redefines `handle_new_user()`, which inserted that column: dropping it alone would break every sign-up. Apply it only after the new web build is live, because the deployed old build still selects the column and would fail to load profiles. Not applied by the agent.

- Skeletons stay on phantom-ui. The first fix corrected how elements are measured. The second wraps self-loading panels (`DirectoryTable`, todo list, activities block, day panel) whole, because a panel inside `Reveal` animated in late and looked like only the stat cards had skeletons.
- The user menu's Profile and Settings both open the settings page, since profile is a card there and no separate page exists. Help & support links to the repo's GitHub issues (`shared/constants/support.ts`) because no support contact exists yet.

## Ops

- Logos are generated: `apps/web/scripts/recolor-logos.py` reads the colours from `shared/brand/theme.json` and rebuilds both themes from the dark masters, then the WebP marks and favicons; `apps/mobile/scripts/generate-brand-assets.py` then rebuilds the mobile icons. The README banner image still has the old gold logo baked in.
- Shipped images are WebP; PNG masters and logos live in `apps/web/design/` and are not deployed. Regenerate WebP from them with `cwebp` if art changes.

- Desktop (Tauri) lives in `src-tauri/` and reuses the web build. Identifier `com.dayflow.app` is kept from released builds, although Tauri warns that it ends in `.app`. App icons come from `bunx tauri icon` on a cream tile with the light logo mark; regenerate them after a brand change. `serde_json` must stay in `Cargo.toml` (the `generate_context!` macro needs it).

## Docs

| File | Role |
|------|------|
| `ARCHITECTURE.md` | Stack, folders, data flow, env, auth redirects, deploy |
| `RULES.md` | Web conventions (shared rules are in the root `docs/RULES.md`) |
| `DESIGN.md` | UI direction (tokens are in `shared/brand/theme.json`) |
| `TASKS.md` | Phased rebuild checklist |
| `MEMORY.md` | This file |

Read order for a new agent: root `docs/PRD.md` → `docs/DATABASE.md` → `docs/RULES.md` → ARCHITECTURE → RULES → DESIGN → TASKS.
