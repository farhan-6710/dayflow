# Rules — DayFlow Web

Shared rules (database, secrets, redirects): [docs/RULES.md](../../../docs/RULES.md). Product: [PRD.md](../../../docs/PRD.md) · Structure: [ARCHITECTURE.md](./ARCHITECTURE.md) · Look: [DESIGN.md](./DESIGN.md).

## Non-negotiable (web)

- Supabase only through `services/`. Features never import `supabaseClient`.
- Table and column names only in `services/db.ts`.

## UX

- Confirm every delete with `ConfirmationModal` (name what goes).
- Toast after every mutation. Never fail silently.
- Unsaved-changes guard on dirty forms.
- Every list/detail screen: loading, empty, error. Loading shaped like that screen (`Phantom` / table / chart skeletons).
- One primary action per page. Row actions in `RowActionsMenu`.
- Disable controls while saving.

## Naming

| Thing | Convention |
|-------|------------|
| Component | `PascalCase.tsx`, named export, one per file |
| Hook | `useCamelCase.ts` |
| Service | `<domain>Service.ts` |
| Route constants | `UPPER_SNAKE` in `app/constants/` |
| Folders | `kebab-case` |
| DB columns in code | `snake_case` as stored |

## Folders

- Feature folders: `features/<portal>/<feature>/{components,hooks,pages,constants,types,utils}` — only create what you need.
- Pages compose; hooks hold logic; services hold queries.
- Shared / cross-portal code in `shared/`. Features do not import other features, except `client-activities`.
- shadcn in `shared/ui/` — wrap in `shared/components/` instead of editing casually.
- Import with `@/`. Lazy-load pages via `lazyRoutePage`.

## Code

- Smallest change. No speculative abstractions.
- Keep presentational files ~120 lines; logic in hooks.
- TypeScript strict. No `any`.
- Semantic tokens only ([DESIGN.md](./DESIGN.md)).
- Entrance motion only through `Reveal` (sign-in demo card is the one exception).
- lucide-react icons · date-fns · brand copy from `brandManifest.json`.

## Client portal

1. Load projects with `fetch_client_portal_projects()`.
2. Activities respect `raised_by` / `forClientPortal`; clients write only `raised_by = 'client'`.
3. Reuse workspace UI through props — never owner-only hooks that assume `user.id` owns the rows.

## Working

- Follow [TASKS.md](./TASKS.md). Verify phone + desktop, light + dark.
- Update TASKS and [MEMORY.md](./MEMORY.md) when work lands. Create other markdown only when asked.
- Demo seed scripts (`scripts/seed-present-month-tasks.ts` and friends) may only target the shared demo account — never seed a personal login.
