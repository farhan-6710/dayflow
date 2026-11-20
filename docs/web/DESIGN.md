# Design — DayFlow (web)

Warm paper surfaces, charcoal primary, one coral accent, serif-forward type. Calm and readable.

## Principles

- Calm over loud: paper surfaces, one accent, restrained motion.
- Semantic tokens everywhere; the theme file is the only place hex values live.
- Every data screen has loading, empty and error states, in both themes, down to 310px.
- Illustration is sample data, never an invented claim (no fake people, reviews or user counts).

**Tokens:** [theme.json](../../shared/brand/theme.json) is the source of truth. In `apps/web`, `bun run theme:generate` writes `shared/brand/theme.css` (imported by `src/index.css`). Never edit generated files or hard-code token values; `bun run build` fails if they are stale.

Shared rules: [docs/RULES.md](../RULES.md). Conventions: [RULES.md](./RULES.md).

## Rules

- Semantic classes only (`bg-background`, `bg-card`, `text-muted-foreground`, …). No hex in components except a project’s `color_hex` from the DB.
- Dark mode: `.dark` via next-themes. Check every screen in both themes.
- Sidebar uses `sidebar-*`. Charts use `chart-1…5`.
- Project colours: the stored `color_hex` is a key. `resolveProjectColor` (`shared/constants/projectColors.ts`) maps it to the nearest `project-*` token (light + dark in theme.json), greys to `project-slate`. `ProjectChip` adds the raised `project-chip` look. Never rewrite `color_hex` in the DB to restyle.

## Colour tokens

Values from `shared/brand/theme.json`. Dark mode is the `.dark` class.

| Token | Light | Dark | Role |
|-------|-------|------|------|
| `background` | `#e9e4d8` | `#141414` | Page |
| `foreground` | `#1e1e1e` | `#e8e3da` | Text |
| `card` / `popover` | `#f4efe4` | `#1c1c1c` | Surfaces |
| `primary` | `#2e2e2e` | `#d1cfc0` | Charcoal CTA, focus ring |
| `secondary` | `#d8d2c4` | `#222222` | Quiet fills |
| `muted` / `muted-foreground` | `#cfc8b8` / `#5e5a52` | `#2a2a2a` / `#8e8a83` | Chrome, secondary text |
| `accent` | `#e6e4d7` | `#363636` | Hover fills |
| `border` / `input` | `#d2cbbb` | `#2c2c2c` | Lines |
| `chart-1` | `#f26a4b` | `#f26a4b` | The coral accent |
| `chart-2…5` | `#1e1e1e` `#5e5a52` `#a89f8f` `#cfc8b8` | `#d9cfc2` `#8e8a83` `#5c5a56` `#3b3b3b` | Chart series |
| `success` | `#21763c` | `#3a714b` | Done / active |
| `destructive` | `#dc2626` | `#ef4444` | Errors, deletes |
| `insight-up` / `insight-down` (+ `-bg`, `-border`) | greens / reds on tinted fills | same, darker fills | Weekly insights |
| `sidebar-*` | follow `card` / `primary` | follow `card` / `primary` | Sidebar |
| `project-*` | tangerine `#cf7a45`, rust, blue, emerald, violet, rose, amber, slate | lighter variants | Project colour chips |

## Type

| Token | Font | Use |
|-------|------|-----|
| `font-sans` | Ovo | UI |
| `font-heading` | Young Serif | `h1` / `h2` |
| `font-serif` | Merriweather | Notes and long text |
| `font-mono` | Merriweather | Timer / numbers — add `tabular-nums` |

Ovo and Young Serif are single-weight — never `font-bold` them. Loaded in `src/index.css` from `@fontsource` (Ovo 400, Young Serif 400, Merriweather 400 and 700). `h1` / `h2` use `--font-heading` at weight 400. Base tracking `0.01em`.

## Shape

- Radius: `--radius` is `1rem` (`theme.json`). `rounded-lg` default, `rounded-xl` for large panels.
- Shadows: soft, offset 4px / blur 10px in light (6px / 15px in dark); `shadow-sm` / `shadow-md` / `shadow-lg`.
- 4px spacing grid (`0.25rem`). Page gutter 16px phone, 24px+ desktop.

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

Entrance only through `Reveal` (+ `entranceMotion.ts`). Route shutter / opener follow `page_transitions` in `user_settings`. Skip under reduced motion and when a form is dirty. Website uses its own `BlurIn` (deliberate exception). Theme switch reveals the new theme as a growing circle from the toggle (View Transitions API, keyframes in `index.css`); sidebar collapse is eased; the assistant streams text in with animated rich text.

## Website

`features/site/` — marketing pages in DayFlow tokens. Name, tagline and descriptions come from `brandManifest.json`; page copy lives in `features/site/constants/`. No invented people, reviews or user counts. Faux UI is illustration sample data, not product claims.

## Brand assets

Share card (`public/share-card.jpg`): cream tile, DayFlow wordmark, Young Serif headline with the coral accent word, Ovo supporting line, domain strip, and the real dashboard screenshot in a tilted browser frame as the signature visual. Source `scripts/share-card/card.html`, built by `bun run share-card`. Tab icons: `favicon-light.png` / `favicon-dark.png` (192px, transparent, mark only, same logo mark recoloured per theme), `apple-touch-icon.png` (180px, mark on cream). Small `.ico` sizes stay hand-hinted.

Logos/favicons in `apps/web/public/`. After theme colour changes: `theme:generate` → `scripts/recolor-logos.py` → `scripts/generate-tauri-icon.py`. WebP icons/illustrations under `public/images/dayflow/`; paths in `shared/constants/dayflowImages.ts`.

## Accessibility

Visible focus ring, labelled icon buttons, keyboard drag-and-drop, ≥40px touch targets, WCAG AA in both themes.
