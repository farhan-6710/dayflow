# DayFlow

Freelancer workspace. One Supabase project (Auth, Postgres, RLS) serves three surfaces, with no sync service between them:

- **Web** — `apps/web`: Vite + React 19 + TypeScript. Workspace (`/workspace`), client portal (`/client-portal`) and public site (`/`). Deployed on Vercel.
- **Desktop** — `apps/web/src-tauri`: Tauri 2 shell around the web build.
- **Mobile** — `apps/mobile`: Flutter (Dart SDK ^3.13.7). UI-only milestone with sample data; Supabase comes later.

This is the only `CLAUDE.md`. It loads the shared docs and each app's docs below. When docs conflict, [docs/RULES.md](./docs/RULES.md) wins.

@docs/RULES.md
@docs/PRD.md
@docs/DATABASE.md
@docs/MEMORY.md

Web and desktop:

@docs/web/RULES.md
@docs/web/ARCHITECTURE.md
@docs/web/DESIGN.md
@docs/web/TASKS.md
@docs/web/MEMORY.md

Mobile:

@docs/mobile/RULES.md
@docs/mobile/ARCHITECTURE.md
@docs/mobile/DESIGN.md
@docs/mobile/TASKS.md
@docs/mobile/MEMORY.md

## Key directories

| Path | Holds |
|------|-------|
| `brandManifest.json` | Brand copy (repo root) |
| `shared/brand/` | `theme.json` (tokens); `theme.css` / `theme.ts` are generated |
| `apps/web/src/` | `app/` router, `features/{workspace,client,site}/`, `services/` (all Supabase access), `shared/` |
| `apps/web/src-tauri/` | Desktop app |
| `supabase/functions/assistant/` | Edge Function for the Flowy assistant |
| `scripts/migrations/`, `scripts/seeds/` | Append-only SQL applied by the owner by hand; owner-run demo cleanup SQL |
| `apps/mobile/lib/` | Flutter app: `app/`, `core/`, `features/`, `shared/` |

## Brand and theme

- Brand copy (name, tagline, descriptions, SEO, portal names and features) comes only from `brandManifest.json` at the repo root. Never type brand text into code. Web reads it through `src/shared/brand/brandManifest.ts` (`BRAND_NAME`, `BRAND_TAGLINE`, ...); `vite.config.ts` reads it for the page title and description. Mobile reads the generated `apps/mobile/lib/core/constants/brand_manifest.dart` (Flutter cannot import JSON from outside its package). After editing the manifest, run `bun run brand:generate` in `apps/web`; `bun run build` fails while that file is stale.
- Known gap: `apps/web/src-tauri/tauri.conf.json` (`productName`, window title) and long marketing copy in `features/site/constants/` are not read from the manifest. See [web TASKS](./docs/web/TASKS.md).
- Colours and other tokens come only from `shared/brand/theme.json`. After editing it, run `bun run theme:generate` in `apps/web`; `bun run build` fails while the generated files are stale. Mobile copies the colours into `lib/core/theme/app_colors.dart` by hand.
- Design details: [web DESIGN](./docs/web/DESIGN.md), [mobile DESIGN](./docs/mobile/DESIGN.md).

## Conventions

- Smallest change that solves the problem. Small, focused files; immutable data; no `any`.
- Web: pages compose, hooks hold logic, services hold queries ([web RULES](./docs/web/RULES.md)).
- Mobile: screens compose widgets, sample data in `core/constants/sample_data/` ([mobile RULES](./docs/mobile/RULES.md)).
- Conventional commit messages (`feat:`, `fix:`, `docs:` …). Never commit `.env` or keys.

## Commands

Web and desktop, from `apps/web` (uses bun):

```bash
bun install
bun run dev
bun run lint
bunx tsc -b --noEmit
bun run build
bun run theme:generate
bun run brand:generate
bun run tauri:dev
bun run tauri:build
```

The web app has no automated test suite yet.

Mobile, from `apps/mobile`:

```bash
flutter pub get
flutter run
dart format .
flutter analyze
flutter test
```

## Before you finish

- Web: `bun run lint`, `bunx tsc -b --noEmit` and `bun run build` pass. Check changed screens on phone and desktop widths, in light and dark.
- Mobile: `dart format .`, `flutter analyze` and `flutter test` pass. Compare changed screens with the reference image, in light and dark.
- `git grep -n "DayFlow" -- apps/web/src apps/mobile/lib` shows only code identifiers (`DayFlowLogo`, `DayFlowApp`), no user-facing brand text.
- Update the app's `TASKS.md` and `MEMORY.md` in `docs/web/` or `docs/mobile/` when work lands.

## Docs

| Doc | Covers |
|-----|--------|
| [docs/PRD.md](./docs/PRD.md) | Product and scope |
| [docs/DATABASE.md](./docs/DATABASE.md) | Tables, RPCs, the database contract |
| [docs/RULES.md](./docs/RULES.md) | Shared non-negotiables |
| [docs/MEMORY.md](./docs/MEMORY.md) | Shared decisions and ops |
| [docs/web/](./docs/web/) | Web architecture (auth redirects, deploy, desktop), design, rules, tasks, memory |
| [docs/mobile/](./docs/mobile/) | Mobile architecture, design, rules, tasks, memory |
