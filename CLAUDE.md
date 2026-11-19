# DayFlow

Freelancer workspace. One Supabase project (Auth, Postgres, RLS) serves three surfaces, with no sync service between them:

- **Web** — `apps/web`: Vite + React 19 + TypeScript. Workspace (`/workspace`), client portal (`/client-portal`) and public site (`/`). Deployed on Vercel.
- **Desktop** — `apps/web/src-tauri`: Tauri 2 shell around the web build.
- **Mobile** — `apps/mobile`: Flutter. UI-only milestone with sample data; Supabase comes later.

Shared rules, product and data are loaded below. Each app's `CLAUDE.md` loads that app's `docs/`; from the repo root, read `apps/<app>/CLAUDE.md` before working in an app. When docs conflict, [docs/RULES.md](./docs/RULES.md) wins.

@docs/RULES.md
@docs/PRD.md
@docs/DATABASE.md
@docs/MEMORY.md

## Key directories

| Path | Holds |
|------|-------|
| `shared/brand/` | `brandManifest.json` (copy), `theme.json` (tokens); `theme.css` / `theme.ts` are generated |
| `apps/web/src/` | `app/` router, `features/{workspace,client,site}/`, `services/` (all Supabase access), `shared/` |
| `apps/web/src-tauri/` | Desktop app |
| `supabase/functions/assistant/` | Edge Function for the Flowy assistant |
| `scripts/migrations/` | Append-only SQL, applied by the owner by hand |
| `apps/mobile/lib/` | Flutter app: `app/`, `core/`, `features/`, `shared/` |

## Brand and theme

- Brand copy (name, tagline, descriptions, portal names and features) comes only from `shared/brand/brandManifest.json`. Never type brand text into code. Web reads it through `src/shared/brand/brandManifest.ts`; mobile reads the generated `lib/core/constants/brand_manifest.dart`. After editing the manifest, run `bun run brand:generate` in `apps/web`.
- Colours and other tokens come only from `shared/brand/theme.json`. After editing it, run `bun run theme:generate` in `apps/web`; `bun run build` fails while the generated files are stale. Mobile copies the colours into `lib/core/theme/app_colors.dart` by hand.
- Design details: [web DESIGN](./apps/web/docs/DESIGN.md), [mobile UI spec](./apps/mobile/docs/UI_SPEC.md).

## Conventions

- Smallest change that solves the problem. Small, focused files; immutable data; no `any`.
- Web: pages compose, hooks hold logic, services hold queries ([web RULES](./apps/web/docs/RULES.md)).
- Mobile: screens compose widgets, sample data in `core/constants/sample_data/` ([mobile RULES](./apps/mobile/docs/RULES.md)).
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
- Update the app's `docs/TASKS.md` and `docs/MEMORY.md` when work lands.

## Docs

| Doc | Covers |
|-----|--------|
| [docs/PRD.md](./docs/PRD.md) | Product and scope |
| [docs/DATABASE.md](./docs/DATABASE.md) | Tables, RPCs, the database contract |
| [docs/RULES.md](./docs/RULES.md) | Shared non-negotiables |
| [docs/MEMORY.md](./docs/MEMORY.md) | Shared decisions and ops |
| [apps/web/docs/](./apps/web/docs/) | Web architecture (auth redirects, deploy, desktop), design, rules, tasks, memory |
| [apps/mobile/docs/](./apps/mobile/docs/) | Mobile architecture, UI spec, rules, tasks, memory |
