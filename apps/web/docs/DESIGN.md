# Design — DayFlow

Warm paper surfaces, charcoal primary, one coral accent, serif-forward type. Calm and readable; depth comes from soft shadows and spacing, not decoration.

**Tokens:** [theme.css](./theme.css) is the source of truth for web and mobile. After `shadcn init`, paste it into `apps/web/src/index.css` and keep shadcn's own imports.

## Rules

- Use semantic classes only: `bg-background`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`. No hex or raw `oklch()` in components.
- The one hex exception is a project's own `color_hex` from the database.
- Dark mode is the `.dark` class (next-themes, `attribute="class"`). Every screen must be checked in both themes.
- Sidebar uses the `sidebar-*` tokens. Charts use `chart-1…5`.

## Type

| Token | Font | Use |
|-------|------|-----|
| `font-sans` | Ovo | UI |
| `font-heading` | Young Serif | Page and panel headings (`h1`, `h2`) |
| `font-serif` | Merriweather | Long text, notes, emphasis |
| `font-mono` | Merriweather (token default) | Timer and numbers: add `tabular-nums` |

Load via `@fontsource/ovo`, `@fontsource/young-serif` (400 only), and `@fontsource/merriweather`. Ovo and Young Serif are single-weight, so never `font-bold` them.

## Shape and depth

- Radius: `rounded-lg` (0.5rem) default, `rounded-xl` for large panels.
- Shadows: `shadow-sm` cards, `shadow-md` popovers, `shadow-lg` dialogs.
- Spacing on the 4px grid. Page gutter 16px on phones, 24px or more on desktop.

## Status colours (tokens only)

| State | Token |
|-------|-------|
| To do / pending | `muted` |
| In progress | `chart-1` (coral) |
| Done / completed | `success` |
| Active (`StatusPill`) | `success` |
| Missed / overdue / destructive | `destructive` |

## Layout

- **Shell:** left sidebar, header, scrollable main area. Sidebar collapses to icons on desktop and becomes a slide-in sheet on small screens.
- **Header:** collapse toggle, `Breadcrumbs`, then page search, theme toggle, bell and a rounded user pill (avatar, first name, chevron) on the right. Breadcrumbs are home, the nav section, then the steps a detail page adds through `usePageBreadcrumbs`; the last is the current page. On phones they sit above the page, as the header has no room.
- **Page:** `PageHeader` (heading, description, actions) then content. No eyebrow above the heading. At most one primary action per page, top right.
- **Lists:** `SummaryStats` row, then a panel holding `ListingToolbar` (search on the left; `PillTabs` status tabs with counts and one filter on the right), the inset `DirectoryTable` and `TablePagination` (7 rows a page). Table on desktop, stacked cards on phones. Only show numbers and statuses the database really has; no sample figures.
- **Row actions:** every list row uses `RowActionsMenu` (kebab) for edit and delete, under a column named "Actions", never inline icon buttons. A row that opens something does so on click.
- **Stat cards:** two columns on phones, four from `xl`. Dashboard and analytics use `StatsCards`: label on the left and icon tile on the right on top, then the value and its caption on one row (`12/45 Still to do, all time`), then the trend chip if present. No divider under the value. List and detail pages use the compact `SummaryStats` (lucide icon in a circle).
- **3D art:** on auth screens, empty states, the sidebar quick-action card, and the not-a-client and error pages. Never in stat cards or page headers.
- **Date filters:** one bordered bar with a dark active pill and the date range after a divider. On the dashboard it sits right of the heading from `xl`.
- **Calendar:** Month, Week and Day tabs beside a selected-day panel, filling the window from `xl`. Week and day are hour timelines: `TIMELINE_START_HOUR` to `TIMELINE_END_HOUR`, opening at 8 AM. Tasks assume 60 minutes, overlapping tasks share the width, and tasks with no time sit in a "No time" row. Week headers scroll with their columns, so they stay aligned on phones.
- **Detail pages:** a chip beside the heading (`leading`) and a meta line, one main action (edit) with less common actions in a menu. Below: `PillTabs` sections, `SummaryStats`, then a work column beside a 22rem rail (`DetailsPanel`, reference links). Panels start with `PanelHeading`. Tabs hide sections rather than unmount them, so nothing refetches. The note editor reads as a page: a sheet behind, a bookmark and a folded corner.
- **Forms:** in dialogs; dirty forms use the unsaved-changes guard.

## Feedback states

Every screen works down to 310px wide. Each data screen has a skeleton (loading), `EmptyState`, and `ErrorBanner`. Mutations show a toast; deletes use `ConfirmationModal`.

Skeletons use [phantom-ui](https://github.com/Aejkatappaja/phantom-ui) through `shared/components/Phantom.tsx`, which measures the real layout and shimmers over it using the `muted` and `card` tokens. Prefer wrapping the real component (`StatsCards`, the calendar) over drawing a second layout. A panel that loads its own data wraps the whole panel in `Phantom`, toolbar included, so it shimmers still with the rest of the page instead of animating in late. `TableSkeleton` covers rows and `ChartSkeleton` covers chart panels; a detail screen composes these with its real `PageHeader` so the skeleton matches the page. Never add a generic screen skeleton: a screen shows exactly one skeleton, its own. While a route's code loads, `PageOutlet` keeps the previous page on screen. Render `Phantom` only while loading, because its host clips overflow. Phantom draws each element's box, so `Phantom` marks anything mixing text with child elements as one block, and `index.css` shrinks text elements to their words while loading. Keep padding off text elements that show in a skeleton, since it counts as bar height, and give values a `min-w` so a loading "0" isn't a sliver. Auth guards and auth pages keep the centred spinner, as there is no page layout to mirror yet.

## Destructive text

`destructive` is under 4.5:1 as small text on the paper surfaces. Use it for icons, fills and borders; keep small destructive labels in the foreground colour with a red icon.

## Motion

Blur, slide and fade on entrance, through `shared/components/Reveal.tsx` (framer-motion) and the scheduler in `shared/lib/entranceMotion.ts`. Timings come from Trail's dashboard. Easing is `cubic-bezier(0.22, 1, 0.36, 1)` throughout.

| `kind` | Use | From | Duration | Stagger |
|--------|-----|------|----------|---------|
| `shell-left` | Sidebar items | x -20, fade | 450ms | 35ms |
| `shell-down` | Header | y -14, fade | 450ms | 35ms |
| `hero` | Page heading lines | y 12, blur 6px, fade | 700ms | 70ms |
| `enter` | Panels and cards, once scrolled into view | y 24, blur 6px, fade | 750ms | 70ms |

Page content starts 80ms after the shell. Each new group starts 85–90ms after the previous group's last start, without waiting for it to finish. Wrap a panel in `Reveal` rather than adding keyframes. The sign-in demo card is the one exception: it slides in from the right after 1 second. The demo buttons are the one place `success` (green) fills a button, to draw the eye there. `success`, `success-foreground` and `success-text` are the only tokens beyond the original paper-and-coral set: they also colour `StatusPill` and `SummaryStats` chips, and `success-text` is the readable green for small text. If an element has a CSS transform transition, as a hoverable card does, put `Reveal` on a wrapper. Nothing inside a skeleton animates, and reduced motion renders everything still. Otherwise hover and press states only. No decorative backgrounds.

## Accessibility

Visible focus ring (`ring` token), labelled icon buttons, keyboard-operable drag and drop, 40px minimum touch targets, WCAG AA contrast in both themes.

## Brand

Copy (name, tagline, descriptions, portal features) comes only from `shared/brand/brandManifest.json`. Logos and favicons are in `apps/web/public/`: charcoal or cream (`foreground`) with a coral (`chart-1`) check. To change their colours, edit `theme.css` and run `apps/web/scripts/recolor-logos.py`, then `apps/mobile/scripts/generate-brand-assets.py`. 3D icons and illustrations ship as WebP in `apps/web/public/images/dayflow/{icons,illustrations}/`, one `-light` and one `-dark` file each; see [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).
