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

## Status colours (proposed, tokens only)

| State | Token |
|-------|-------|
| To do / pending | `muted` |
| In progress | `chart-1` (coral) |
| Done / completed | `primary` |
| Missed / overdue / destructive | `destructive` |

## Layout

- **Shell:** left sidebar, header, scrollable main area. Sidebar collapses to icons on desktop and becomes a slide-in sheet on small screens.
- **Page:** `PageHeader` (eyebrow, heading, description, actions) then content.
- **Lists:** table on desktop, stacked cards on phones. Search and filters sit above the list.
- **Detail pages:** back link and primary actions (edit, delete, related links) in the header.
- **Forms:** in dialogs; dirty forms use the unsaved-changes guard.

## Feedback states

Each data screen has a skeleton (loading), `EmptyState`, and `ErrorBanner`. Mutations show a toast; deletes use `ConfirmationModal`.

## Motion

Subtle: short page fade, list entrance stagger, hover and press states, via framer-motion. Honour `prefers-reduced-motion`. No decorative backgrounds.

## Accessibility

Visible focus ring (`ring` token), labelled icon buttons, keyboard-operable drag and drop, 40px minimum touch targets, WCAG AA contrast in both themes.

## Brand

Copy (name, tagline, descriptions, portal features) comes only from `shared/brand/brandManifest.json`. Logos, favicons and 3D illustrations were removed with the old app; restore from git per [WEB_ENV_AND_LINKS.md](./WEB_ENV_AND_LINKS.md).
