# Design — DayFlow Web

Warm paper surfaces, charcoal primary, one coral accent, serif-forward type. Calm and readable.

**Tokens:** [theme.json](../../../shared/brand/theme.json) is the source of truth. In `apps/web`, `bun run theme:generate` writes `shared/brand/theme.css` (imported by `src/index.css`). Never edit generated files or hard-code token values; `bun run build` fails if they are stale.

Shared rules: [docs/RULES.md](../../../docs/RULES.md). Conventions: [RULES.md](./RULES.md).

## Rules

- Semantic classes only (`bg-background`, `bg-card`, `text-muted-foreground`, …). No hex in components except a project’s `color_hex` from the DB.
- Dark mode: `.dark` via next-themes. Check every screen in both themes.
- Sidebar uses `sidebar-*`. Charts use `chart-1…5`.
- Project colours: the stored `color_hex` is a key. `resolveProjectColor` (`shared/constants/projectColors.ts`) maps it to the nearest `project-*` token (light + dark in theme.json), greys to `project-slate`. `ProjectChip` adds the raised `project-chip` look. Never rewrite `color_hex` in the DB to restyle.

## Type

| Token | Font | Use |
|-------|------|-----|
| `font-sans` | Ovo | UI |
| `font-heading` | Young Serif | `h1` / `h2` |
| `font-serif` | Merriweather | Notes and long text |
| `font-mono` | Merriweather | Timer / numbers — add `tabular-nums` |

Ovo and Young Serif are single-weight — never `font-bold` them.

## Shape

- Radius: `rounded-lg` default, `rounded-xl` for large panels.
- Shadows: `shadow-sm` / `shadow-md` / `shadow-lg`.
- 4px spacing grid. Page gutter 16px phone, 24px+ desktop.

## Status colours

| State | Token |
|-------|-------|
| To do / pending | `muted` |
| In progress | `chart-1` |
| Done / active | `success` |
| Missed / destructive | `destructive` |

`destructive` fails AA as small text on paper — use it for icons/fills; keep small labels in foreground with a red icon.

## Layout patterns

- **Shell:** collapsible sidebar (sheet on small screens), header, scrollable main.
- **Header:** breadcrumbs, search, theme, bell, user pill. Phone breadcrumbs sit above the page.
- **Page:** `PageHeader` then content. One primary action, top right.
- **Lists:** `SummaryStats` → toolbar (search + status tabs) → `DirectoryTable` → `TablePagination` (7 rows). Cards on phones. Row actions only in `RowActionsMenu`.
- **Stats:** `StatsCards` on dashboard/analytics; compact `SummaryStats` on list/detail.
- **Detail:** chip + meta, section `PillTabs`, work column + 22rem rail. Tabs hide sections (stay mounted).
- **Calendar:** Month / Week / Day; hour grid `TIMELINE_START_HOUR`–`TIMELINE_END_HOUR`; tasks default 60 minutes; no-time row.
- **Reminders:** cards (not a table), two columns from 640px.
- **3D art:** auth, empty states, sidebar quick action, error pages — never in stat cards or page headers.
- **Forms:** dialogs + unsaved-changes guard.

## Feedback

Every data screen: `Phantom` / `TableSkeleton` / `ChartSkeleton`, `EmptyState`, `ErrorBanner`. Toasts on mutations; `ConfirmationModal` on deletes. Works down to 310px. Render `Phantom` only while loading.

## Motion

Entrance only through `Reveal` (+ `entranceMotion.ts`). Route shutter / opener follow `page_transitions` in `user_settings`. Skip under reduced motion and when a form is dirty. Website uses its own `BlurIn` (deliberate exception).

## Website

`features/site/` — marketing pages in DayFlow tokens. Brand strings from `brandManifest.json`. No invented people, reviews or user counts. Faux UI is illustration sample data, not product claims.

## Brand assets

Logos/favicons in `apps/web/public/`. After theme colour changes: `theme:generate` → `scripts/recolor-logos.py` → `scripts/generate-tauri-icon.py`. WebP icons/illustrations under `public/images/dayflow/`; paths in `shared/constants/dayflowImages.ts`.

## Accessibility

Visible focus ring, labelled icon buttons, keyboard drag-and-drop, ≥40px touch targets, WCAG AA in both themes.
