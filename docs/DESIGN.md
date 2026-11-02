# Design — DayFlow

## Direction

DayFlow shares **Trail's design system** (same product family): warm cream surfaces, golden-yellow primary, espresso ink, Ovo headings, compact 90% density. Light by default; dark uses Trail's espresso tokens.

- **Tokens:** `apps/web/src/index.css` mirrors Trail's palette, radius scale (`--radius: 1rem`), and type scale. DayFlow-only tokens (`status-*`, `contrib-*`, `primary-text`) are derived from it. Never hard-code colors.
- **Surfaces:** panels use `surface-elevated` (optionally `tone-success|primary|rose|lavender`) at `rounded-[1.25rem]`; nested rows use `surface-chip`; buttons use the `btn-elevated` variants. Constants live in `shared/constants/layoutStyles.ts`.
- **Headings:** `PageHeader` = amber `EyebrowPill` + large Ovo title + description; panel titles are `text-2xl font-bold` Ovo.
- **Shell:** cream sidebar frame with an inset, rounded content panel and a sticky bordered header (`AppShellLayout`). Auth = Trail split layout (brand panel + form).
- **Shared blocks:** `StatCard` (tinted, big Ovo number, 3D icon), `EmptyState`, `StatusPill`, `ErrorBanner`, `DirectoryTable`.

**Tagline:** Organize your day. Elevate your flow.  
**Description:** A workspace built for freelancers to manage clients, projects, tasks, meetings, notes, reminders, and more — all in one place.

**Source of truth:** `apps/web/src/shared/brand/brandManifest.json`  
**Assets:** `apps/web/public/` (logos, favicons, promotion banners)

The auth brand panel renders tagline, description, and portal features straight from the manifest. Promo banner images (docs/marketing) must mirror the same copy — change the manifest first, then update banner images.

## Layout patterns

| Pattern | Use |
|---------|-----|
| `PageHeader` + `PageContent` | Standard page chrome |
| `DirectoryTable` + `DirectoryTableRow` | List/directory screens |
| Listing search + `OptionDropdown` | Filters; control height aligned (`h-9`) |
| Detail headers | Primary actions in the header (edit, delete, related links) |

## Components & feedback

- Project chip: `color_hex` background + white Lucide icon
- Toasts via `showToast` after mutations
- Destructive actions via `ConfirmationModal`
- Loading / empty / error states on list and detail screens — no blank hangs
- Presentational blocks stay lean; logic in hooks

## Portal UX

| Portal | Focus |
|--------|-------|
| Workspace | Owner runs clients, projects, tasks, meetings, notes, reminders |
| Client portal | Shared projects + raise activities; no owner-only chrome |

Reuse presentational blocks across portals with props (`forClientPortal`, etc.). Do not leak workspace-owner hooks into the client portal.

## Interaction notes

- Tasks calendar: browse by day; add/edit from a date
- Client activities: Add New when the user can edit; date/time, priority, status
- Notes: category filter/search; optional reference links
- Projects: active/inactive (not “archive”)

## Motion

Trail's CSS entrance choreography (`shared/lib/entranceMotion.ts`): `animate-shell-*` for chrome, `animate-hero` for page headers, `animate-enter` for sections (via `FluidWaveItem` / `PageContent`). Routes cross-fade quickly. `prefers-reduced-motion` disables animation globally. No decorative backgrounds.
