# Design — DayFlow (mobile)

What the UI-only milestone builds. The visual specification is `apps/mobile/images/DayFlow Mobile App Showcase.png`. Rules: [RULES.md](./RULES.md). Structure: [ARCHITECTURE.md](./ARCHITECTURE.md). Progress: [TASKS.md](./TASKS.md).

**What decides the look:** the reference image first, then this file, then the [web DESIGN](../web/DESIGN.md) for anything the image does not show. Colours come only from [theme.json](../../shared/brand/theme.json); brand copy only from [brandManifest.json](../../brandManifest.json).

## Principles

- Same warm paper, charcoal and coral look as web, in a phone-sized layout.
- Match the reference; where the image and this file differ, the image wins.
- Light and dark everywhere, no overflow from 310 wide, 48 by 48 tap targets, status never by colour alone.

## Colour tokens

Hex values live only in `lib/core/theme/app_colors.dart`, copied by hand from `theme.json`. They match web (see [web DESIGN](../web/DESIGN.md#colour-tokens)): light `background #e9e4d8`, `card #f4efe4`, `primary #2e2e2e`, coral accent `#f26a4b`; dark `background #141414`, `card #1c1c1c`, `primary #d1cfc0`. Two colours exist only on mobile, for icon tiles in the reference: `tileWarm` (`#f8dfd0` light, `#3a2a23` dark) and `tileAmber` (`#f7ecd2` light, `#2e2919` dark). `tileNeutral` reuses theme values. The theme follows the device on start; the Light / Dark choice on More is not saved.

## Type

Fonts are bundled `.ttf` files (Flutter cannot use the web's `.woff2`), declared in `pubspec.yaml`.

| Family | Use |
|--------|-----|
| Ovo (`fonts/Ovo-Regular.ttf`) | Body 15, body small 13, caption 12, nav label 11.5 |
| Young Serif (`fonts/YoungSerif-Regular.ttf`) | Greeting 28, page title 22, section title 19, metric value 23, card title 15 |

Both have one weight, so never bold them. Young Serif styles turn on lining figures; letter spacing is 0. Web also uses Merriweather; mobile does not bundle it.

## Shape and spacing

`core/constants/app_dimensions.dart`: spacing 4 / 8 / 12 / 16 / 20 / 24 (page gutter 16); radius tile 18, card 16, control 12, pill 999; tap target 48; one soft card shadow (`0x0D000000`, blur 10, offset 4).

## Motion

Short and restrained: 160 ms fading page transitions, 180 ms pill and calendar-cell changes, 200 ms bottom-nav, 2 s toasts. Page fades drop to zero under reduced motion.

## Component hierarchy

1. `core/widgets/`: shared base components (`AppCard`, `AppBottomSheet`, `AppConfirmDialog`, `AppEmptyState`, `AppFilterPill`, `AppSearchField`, `AppStatusChip`, `AppToast`, ...).
2. `shared/widgets/`: pieces used by more than one feature (`MetricCard`, `MetricGrid`, `StatusFilterRow`, `WeekdayChips`, `ItemFormSheet`).
3. `features/<name>/widgets/`: that feature's pieces. `screens/` only compose.

## Screen composition

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
| Shared | Drawer, menus, sheets, dialogs, empty states, light and dark. These are not in the image, so they follow the web design. |

## Notes

- The image's phone frames, status bars and top banner are presentation only and are not built.
- The image's paper colour looks warmer than the tokens. The tokens win (owner decision, 2026-11-05).
- Sample values come from the image (14 pending, 604 completed, 15 projects, 11 clients) and live in `lib/core/constants/sample_data/`.
- Icons are Material's outlined set. Empty-state art in `images/icons/` and `images/illustrations/` is shared with web; only `images/brand/` and `images/illustrations/` are bundled in `pubspec.yaml`.

## Dependencies

Flutter SDK only (`flutter_lints` for analysis). `fl_chart` or `intl` may be added only when the SDK cannot reasonably do the job; say why first. No state-management, networking, database, auth, calendar, animation or icon packages in this milestone.
