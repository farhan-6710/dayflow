# UI spec — DayFlow Mobile (Flutter)

What the UI-only milestone builds. The visual specification is `images/DayFlow Mobile App Showcase.png`. Rules: [RULES.md](./RULES.md). Structure: [ARCHITECTURE.md](./ARCHITECTURE.md). Progress: [TASKS.md](./TASKS.md).

**What decides the look:** the reference image first, then this file, then the [web DESIGN](../web/DESIGN.md) for anything the image doesn't show. Colours come only from [theme.json](../../shared/brand/theme.json); brand copy only from [brandManifest.json](../../shared/brand/brandManifest.json).

## Screens

Bottom navigation with five tabs: Home, Tasks, Projects, Clients, More. Every screen has a menu icon at the top left that opens a drawer listing all destinations, including Daily Reminders.

| Screen | Build |
|--------|-------|
| Sign in | Brand, email and password (with visibility toggle), forgot password, Google and demo buttons, create-account link. UI only. |
| Dashboard | Greeting and date, metric cards, task-completion chart; below the chart: todo list, weekly insights, activity snapshot, time tracker. |
| Tasks Calendar | Month grid with previous and next arrows (no Month/Week/Day selector). Dark `+` button beside search. Task cards show time range, title, a Completed chip and a menu. |
| Projects | Title, search icon, `+` button. Two summary cards (Total, Active). Status pills that scroll sideways. Rows: coloured folder, name, client, menu. No type filter, chips or pagination. |
| Clients | Title, search icon, `+` button. Two summary cards (Total, Active). Search field and status pills. Rows: company, contact, Active chip, menu. |
| Daily Reminders | Title and `+` button. Cards: pale icon tile, title, description, next time, weekday chips, menu. |
| More | Profile, a list of four destinations, a "Portals" group of two, and the Light / Dark selector. |
| Shared | Drawer, menus, sheets, dialogs, empty states, light and dark. These aren't in the image, so they follow the web design. |

## Notes

- The image's phone frames, status bars and top banner are presentation only and aren't built.
- The image's paper colour looks warmer than the tokens. The tokens win (owner decision, 2026-11-05).
- Sample values come from the image (14 pending, 604 completed, 15 projects, 11 clients) and live in `lib/core/constants/sample_data/`.
- Icons are Material's outlined set. Fonts are bundled `.ttf` files (Ovo, Young Serif, Merriweather), because Flutter can't use the web's `.woff2`.

## Dependencies

Flutter SDK only. `fl_chart` or `intl` may be added only when the SDK can't reasonably do the job; say why first. No state-management, networking, database, auth, calendar, animation or icon packages in this milestone.
