# Rules — DayFlow

For developers and AI agents. Product: [PRD.md](./PRD.md) · Structure: [ARCHITECTURE.md](./ARCHITECTURE.md) · Look: [DESIGN.md](./DESIGN.md).

## Non-negotiable

- **Never change the database**: no migrations, schema, RLS or data edits. The rebuild reads and writes existing tables only.
- **Supabase only through `services/`.** Features never import `supabaseClient`.
- **Table and column names live only in `services/db.ts`.**
- **RLS is the access contract.** Owners by `user_id` / `owner_user_id`; clients only through the portal RPCs.
- **Never commit** `.env`, credentials or keys. Use the existing `VITE_SUPABASE_*` variables.
- **Auth redirect paths stay exactly as listed** in [WEB_ENV_AND_LINKS.md](./WEB_ENV_AND_LINKS.md).

## UX behaviour

- **Confirm every delete** with `ConfirmationModal`, naming what is deleted and what goes with it.
- **Toast after every mutation** (`showToast` success or error). Never fail silently.
- **Unsaved-changes guard** on every form that can be dirty.
- **Every list and detail screen has loading, empty and error states.** No blank screens. Loading uses `Phantom`, `TableSkeleton` or `ChartSkeleton`, shaped like that screen. No hand-drawn placeholder bars and no generic screen skeleton.
- **One primary action per page.** Row actions go in `RowActionsMenu`.
- **Disable controls while saving** to prevent double submits.

## Naming

| Thing | Convention | Example |
|-------|------------|---------|
| Component file and export | `PascalCase.tsx`, named export, one per file | `ProjectsTable.tsx` |
| Hook | `useCamelCase.ts` | `useProjectDetail.ts` |
| Service | `<domain>Service.ts` | `tasksService.ts` |
| Route constants | `UPPER_SNAKE` in `app/constants/` | `WORKSPACE_DASHBOARD_PATH` |
| Other constants and utils | `camelCase.ts` | `noteCategories.ts` |
| Folders | `kebab-case` | `clients-management/` |
| Props type | `ComponentNameProps` in `types/components.ts` | `ClientDialogProps` |
| Domain types | `types/types.ts` | `Task`, `Client` |
| Database columns in code | `snake_case` as stored | `project_for` |

## Files and folders

- Group by feature: `features/<portal>/<feature>/{components,hooks,pages,constants,types,utils}`. Create a subfolder only when it has files.
- A page composes components and hooks. It holds no query logic.
- Anything used by both portals or more than one feature goes in `shared/`. Features never import from another feature, except the shared `client-activities` module.
- shadcn components live in `shared/ui/` and are not edited casually. Wrap them in `shared/components/` instead.
- Import with the `@/` alias, never long relative paths.
- Lazy-load every route page through `lazyRoutePage`.

## Code

- Smallest change that solves the problem. No speculative abstractions.
- Presentational components stay around 120 lines; move logic into hooks.
- TypeScript strict. No `any`. Type everything that crosses a service boundary.
- Use semantic design tokens only (see [DESIGN.md](./DESIGN.md)).
- Entrance motion only through `Reveal`; no one-off page animations.
- Icons from lucide-react. Dates with date-fns.
- Brand copy only from `shared/brand/brandManifest.json`.

## Client portal

1. Use `fetch_client_portal_projects()` from the client session.
2. Activities respect `raised_by` and `forClientPortal`; clients write only `raised_by = 'client'`.
3. Reuse presentational workspace blocks through props. Never import owner-only hooks that assume `user.id` owns the data.

## Working

- Build in the order of [TASKS.md](./TASKS.md); finish and verify one feature before the next.
- Verify in the browser at phone and desktop widths, in light and dark.
- Update [TASKS.md](./TASKS.md) when work lands. Create other markdown only when asked.
