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
| `font-sans` | Ovo | UI and headings |
| `font-serif` | Merriweather | Long text, notes, emphasis |
| `font-mono` | Merriweather (token default) | Timer and numbers: add `tabular-nums` |

Load via `@fontsource/ovo` and `@fontsource/merriweather`. Ovo has a single weight, so build hierarchy with size, colour and spacing rather than `font-bold`. Check that visually.

## Shape and depth

- Radius: `rounded-lg` (0.5rem) default, `rounded-xl` for large panels.
- Shadows: `shadow-sm` cards, `shadow-md` popovers, `shadow-lg` dialogs.
- Spacing on the 4px grid. Page gutter 16px on phones, 24px or more on desktop.

## Status colours (tokens only)

| State | Token |
|-------|-------|
| To do / pending | `muted` |
| In progress | `chart-1` (coral) |
| Done / completed | `primary` |
| Active (`StatusPill`) | `success` |
| Missed / overdue / destructive | `destructive` |

## Layout

- **Shell:** left sidebar, header, scrollable main area. Sidebar collapses to icons on desktop and becomes a slide-in sheet on small screens.
- **Page:** `PageHeader` (`Breadcrumbs`, heading, description, actions) then content. No eyebrow above the heading. At most one primary action per page, top right.
- **Lists:** `SummaryStats` row, then a panel holding `ListingToolbar` (`PillTabs` status tabs with counts, one filter opposite, search beneath), the inset `DirectoryTable` and `TablePagination` (7 rows a page). Table on desktop, stacked cards on phones. Only show numbers and statuses the database really has; no sample figures.
- **Row actions:** every list row uses `RowActionsMenu` (kebab) for edit and delete, under a column named "Actions", never inline icon buttons. A row that opens something does so on click.
- **Stat cards:** two columns on phones, four from `xl`. Dashboard and analytics use `StatsCards` (3D icon, sparkline). List and detail pages use the compact `SummaryStats` (lucide icon in a circle).
- **Detail pages:** breadcrumb with a back arrow, a chip beside the heading (`leading`) and a meta line, one main action (edit) with less common actions in a menu. Below: `PillTabs` sections, `SummaryStats`, then a work column beside a 22rem rail (`DetailsPanel`, reference links). Panels start with `PanelHeading`. Tabs hide sections rather than unmount them, so nothing refetches. The note editor reads as a page: a sheet behind, a bookmark and a folded corner.
- **Forms:** in dialogs; dirty forms use the unsaved-changes guard.

## Feedback states

Each data screen has a skeleton (loading), `EmptyState`, and `ErrorBanner`. Mutations show a toast; deletes use `ConfirmationModal`.

Skeletons use [phantom-ui](https://github.com/Aejkatappaja/phantom-ui) through `shared/components/Phantom.tsx`, which measures the real layout and shimmers over it using the `muted` and `card` tokens. Prefer wrapping the real component (`StatsCards`, the calendar) over drawing a second layout. `TableSkeleton` covers rows and `ChartSkeleton` covers chart panels; a detail screen composes these with its real `PageHeader` so the skeleton matches the page. Never add a generic screen skeleton: a screen shows exactly one skeleton, its own. While a route's code loads, `PageOutlet` keeps the previous page on screen. Render `Phantom` only while loading, because its host clips overflow. Auth guards and auth pages keep the centred spinner, as there is no page layout to mirror yet.

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

Page content starts 80ms after the shell. Each new group starts 85–90ms after the previous group's last start, without waiting for it to finish. Wrap a panel in `Reveal` rather than adding keyframes. The sign-in demo card is the one exception: it slides down from above the screen after 1 second, and is the one place `success` (green) fills a button, to draw the eye there. `success`, `success-foreground` and `success-text` are the only tokens beyond the original paper-and-coral set: they also colour `StatusPill` and `SummaryStats` chips, and `success-text` is the readable green for small text. If an element has a CSS transform transition, as a hoverable card does, put `Reveal` on a wrapper. Nothing inside a skeleton animates, and reduced motion renders everything still. Otherwise hover and press states only. No decorative backgrounds.

## Accessibility

Visible focus ring (`ring` token), labelled icon buttons, keyboard-operable drag and drop, 40px minimum touch targets, WCAG AA contrast in both themes.

## Brand

Copy (name, tagline, descriptions, portal features) comes only from `shared/brand/brandManifest.json`. Logos and favicons are in `apps/web/public/`. 3D icons and illustrations ship as WebP in `apps/web/public/images/dayflow/{icons,illustrations}/`, one `-light` and one `-dark` file each; see [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md).
