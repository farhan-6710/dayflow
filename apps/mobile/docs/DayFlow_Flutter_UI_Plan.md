# DayFlow Flutter App --- UI/UX Implementation Plan

> **Project scope:** Build the DayFlow mobile app UI in Flutter,
> matching the supplied reference design as closely as possible. This
> plan covers **UI and UX only**. All screens must use local dummy data
> from constants. There must be no backend, database, authentication
> service, API, network request, or external account connection.

## 0. Reference check (added before Phase 1)

The plan was checked against `images/DayFlow Mobile App Showcase.png`. **Where they differ, the image wins**, and this section overrides the phases below.

| Screen | The plan says | The image shows, so build this |
|---|---|---|
| Dashboard | Metric cards and chart first, then todo, insights, snapshot and time tracker | The same. The image ends at the chart, so the other cards follow below it when scrolling |
| Tasks Calendar | Month, Week and Day selector | No selector: only the month grid, with previous and next arrows |
| Tasks Calendar | Add-task action | A dark `+` icon button in the top bar, beside search |
| Tasks Calendar | Task cards with priority and description | Time range, title, a Completed chip and three dots |
| Projects | Heading description and New Project button | Title, search icon and `+` button only |
| Projects | Four summary cards | Two: Total and Active |
| Projects | Search field and type filter | Search icon only, and status pills that scroll sideways. No type filter, no pagination |
| Projects | Status chip on each row | Coloured folder, name, client and three dots, with no chip |
| Clients | Heading description and New Client button | Title, search icon and `+` button only |
| Clients | Four summary cards | Two: Total and Active |
| Clients | Portal filter and email on rows | Search field and status pills. Rows show company, contact, Active chip and three dots |
| Daily Reminders | Heading description and New Reminder button | Title and `+` button only |
| Daily Reminders | Title, description, next time, days, menu | The same, plus a pale icon tile at the left of each card |
| More | Destinations and theme selector | Profile, list of four, "Portals" group of two, and the Light and Dark selector |

**Not shown in the image, so these follow the web design:**

- **Reaching Daily Reminders:** it isn't a tab or a More row, and no tab is highlighted on that screen. Every screen has a menu icon at the top left, so that opens a drawer listing all destinations, including Daily Reminders.
- **Sign in, drawer, menus, sheets, dialogs, dark mode, and the cards below the Dashboard chart.**

**Also:**

- The phone frames, status bars and top banner in the image are presentation only, and aren't built.
- Colours use the tokens below. The image's paper colour looks slightly warmer than the tokens, but the tokens are the source of truth.
- Sample values come from the image, for example 14 pending, 604 completed, 15 projects and 11 clients.
- Icons use Material's outlined set, the closest match without adding a package.
- Fonts come from Google Fonts as `.ttf` files, because Flutter can't use the web's `.woff2` files.

## 1. Non-negotiable implementation rules

### Reference fidelity

-   Treat the supplied DayFlow mobile-screen reference image and the
    supplied web screenshots as the visual source of truth.
-   Recreate the reference screens as closely as Flutter allows: layout,
    spacing, sizing, typography, colors, borders, corner radii, icon
    placement, card hierarchy, navigation, and visible content.
-   Do not redesign, reinterpret, simplify away, or introduce a
    different visual style. Avoid visual mistakes and inconsistent
    spacing.
-   Use the provided DayFlow theme tokens below as the single source of
    truth for light and dark themes.
-   Compare each implemented screen against the reference image while
    building. Correct mismatches before moving to the next phase.
-   The reference image shows the intended mobile information hierarchy
    and bottom-tab navigation. Preserve that structure while adapting
    layouts naturally to real phone dimensions.

### UI-only scope --- strictly enforced

-   Build presentation and local UI state only.
-   Use static/sample data stored in a `constants/` folder. Do not
    hardcode repeated sample records inside widgets.
-   No database, backend, API, HTTP client, Firebase, Supabase,
    authentication provider, analytics service, push notification
    service, cloud storage, or third-party account connection.
-   No real sign-in, Google sign-in, password reset, demo-account
    authentication, CRUD persistence, reminders scheduling, task
    scheduling, or time tracking logic.
-   Buttons, filters, search fields, tabs, menus, and forms may show
    visual states or simple in-memory interactions only when needed to
    demonstrate the UI. Do not connect them to real services or persist
    data.
-   Do not add functionality beyond what is required to preview the
    screens and their visual states.
-   Use realistic dummy content matching the reference screenshots.

### Code quality and maintainability

-   Use clean, beginner-friendly Flutter and Dart. Prefer readable code
    over clever abstractions.
-   Keep each widget/component file around **120 lines or less**. Treat
    120 lines as a strong guideline, not a reason to split every tiny
    expression into a separate file. If a file grows beyond this,
    extract focused widgets.
-   Split screens into small, reusable components. Avoid giant `build()`
    methods and deeply nested widget trees.
-   Use clear names, consistent formatting, `const` constructors
    wherever possible, and immutable model classes for sample data.
-   Keep UI, theme, reusable widgets, screen composition, and sample
    data in separate folders.
-   Avoid unnecessary packages and dependencies. Prefer Flutter SDK
    widgets and built-in animation APIs.
-   Do not create generic abstractions until they are genuinely reused.

## 2. Product and screen scope

**Product:** DayFlow\
**Tagline:** Organize your day. Elevate your flow.\
**Description:** A workspace built for freelancers to manage clients,
projects, tasks, meetings, notes, reminders, and more --- all in one
place.

Build the following mobile screens and supporting UI:

1.  **Sign in** --- brand presentation, email/password fields, password
    visibility icon, forgot-password link, Google/demo visual actions,
    and create-account link. UI only.
2.  **Dashboard** --- greeting/date, summary metric cards,
    task-completion chart, todo list, weekly insights, activity
    snapshot, and time-tracker card.
3.  **Tasks Calendar** --- month/week/day selector, calendar grid,
    selected date, task count, task cards, status indicators, and
    add-task visual action.
4.  **Projects** --- project summary cards, search field, status
    filters, type filter, project list, colored project icons, and
    pagination treatment if visible in the reference.
5.  **Clients** --- client summary cards, search field, status/portal
    filters, client list, contact details, status chips, and row
    actions.
6.  **Daily Reminders** --- reminder cards with title, description, next
    reminder text, weekday chips, and overflow menu.
7.  **More / secondary destinations** --- profile summary, Analytics,
    Notifications, Account, Settings, Workspace Portal, Client Portal,
    and light/dark theme selector as shown in the reference.
8.  **Shared UI states** --- bottom navigation selected states,
    drawers/menus, dialogs/sheets, empty states where visually
    appropriate, and light/dark appearance.

The mobile app should use a persistent **bottom navigation bar** with
five destinations matching the reference: - Home - Tasks - Projects -
Clients - More

The active destination must be visually distinct and consistent across
all screens. Daily Reminders and secondary destinations can be reached
through the More area or the navigation structure shown in the
reference. Keep the navigation behavior local and UI-only.

## 3. Theme tokens and visual system

Create a centralized theme implementation based on the supplied token
JSON. Do not scatter hex values across widgets.

### Light theme

  Token               Value
  ------------------- -----------
  background          `#e9e4d8`
  foreground          `#1e1e1e`
  card / popover      `#f4efe4`
  primary             `#2e2e2e`
  primaryForeground   `#e6e4d7`
  secondary           `#d8d2c4`
  muted               `#cfc8b8`
  mutedForeground     `#5e5a52`
  border / input      `#d2cbbb`
  accent              `#e6e4d7`
  destructive         `#dc2626`
  chartAccent         `#f26a4b`
  success             `#21763c`
  sidebar             `#f4efe4`

### Dark theme

  Token               Value
  ------------------- -----------
  background          `#141414`
  foreground          `#e8e3da`
  card / popover      `#1c1c1c`
  primary             `#d1cfc0`
  primaryForeground   `#363636`
  secondary           `#222222`
  muted               `#2a2a2a`
  mutedForeground     `#8e8a83`
  border / input      `#2c2c2c`
  accent              `#363636`
  destructive         `#ef4444`
  chartAccent         `#f26a4b`
  success             `#3a714b`
  sidebar             `#1c1c1c`

Also preserve the supplied semantic insight colors for positive/negative
indicators, including their foreground, background, and border variants.
Add any missing semantic token only when required by a visible UI
element and document it centrally.

### Typography

-   Use the supplied font direction: `Ovo` for the main UI/body,
    `Young Serif` for prominent headings, and `Merriweather` only where
    the reference requires it.
-   Prefer bundling the font files in the project and declaring them in
    `pubspec.yaml` for consistent rendering. Do not rely on fetching
    fonts at runtime.
-   Match font sizes, weights, line heights, and letter spacing to the
    reference.
-   Keep text readable on small phones; avoid clipping and overflow.

### Shape and elevation

-   Default card radius: approximately 16px (adapt to the reference).
-   Use thin, low-contrast borders and subtle shadows. Avoid heavy
    elevation or excessive glass/gradient effects.
-   Keep spacing consistent using a small spacing scale (for example 4,
    8, 12, 16, 20, 24, 32).
-   Use the same icon style and stroke weight throughout. Prefer Flutter
    Material icons unless a specific icon cannot be represented well.

## 4. Recommended project architecture

Use a feature-first structure. Keep shared design-system code separate
from individual feature screens.

``` text
lib/
├── main.dart
├── app/
│   ├── app.dart
│   ├── app_shell.dart
│   └── navigation/
│       ├── app_bottom_nav.dart
│       ├── app_destinations.dart
│       └── app_scaffold.dart
├── core/
│   ├── constants/
│   │   ├── app_assets.dart
│   │   ├── app_dimensions.dart
│   │   ├── app_strings.dart
│   │   └── sample_data/
│   │       ├── dashboard_data.dart
│   │       ├── tasks_data.dart
│   │       ├── projects_data.dart
│   │       ├── clients_data.dart
│   │       └── reminders_data.dart
│   ├── theme/
│   │   ├── app_colors.dart
│   │   ├── app_text_styles.dart
│   │   ├── app_theme.dart
│   │   └── app_theme_extension.dart
│   ├── utils/
│   │   ├── date_formatters.dart
│   │   └── responsive.dart
│   └── widgets/
│       ├── app_card.dart
│       ├── app_icon_button.dart
│       ├── app_search_field.dart
│       ├── app_section_header.dart
│       ├── app_status_chip.dart
│       ├── app_empty_state.dart
│       └── app_bottom_sheet.dart
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   │   └── sign_in_screen.dart
│   │   └── widgets/
│   ├── dashboard/
│   │   ├── screens/
│   │   │   └── dashboard_screen.dart
│   │   └── widgets/
│   │       ├── dashboard_header.dart
│   │       ├── metric_grid.dart
│   │       ├── metric_card.dart
│   │       ├── task_completion_card.dart
│   │       ├── completion_chart.dart
│   │       ├── todo_list_card.dart
│   │       ├── weekly_insights_card.dart
│   │       ├── activity_snapshot_card.dart
│   │       └── time_tracker_card.dart
│   ├── tasks/
│   │   ├── screens/
│   │   │   └── tasks_calendar_screen.dart
│   │   └── widgets/
│   │       ├── calendar_header.dart
│   │       ├── calendar_view_switcher.dart
│   │       ├── month_calendar_grid.dart
│   │       ├── calendar_day_cell.dart
│   │       ├── task_day_header.dart
│   │       └── task_list_item.dart
│   ├── projects/
│   │   ├── screens/
│   │   │   └── projects_screen.dart
│   │   └── widgets/
│   ├── clients/
│   │   ├── screens/
│   │   │   └── clients_screen.dart
│   │   └── widgets/
│   ├── reminders/
│   │   ├── screens/
│   │   │   └── reminders_screen.dart
│   │   └── widgets/
│   └── more/
│       ├── screens/
│       │   └── more_screen.dart
│       └── widgets/
└── shared/
    ├── models/
    │   ├── task_item.dart
    │   ├── project_item.dart
    │   ├── client_item.dart
    │   └── reminder_item.dart
    └── widgets/
        ├── weekday_selector.dart
        ├── filter_pill.dart
        └── page_container.dart
```

This is a starting structure, not a requirement to create every empty
file immediately. Add files only when a real widget or model is needed.
Keep feature-specific widgets inside their feature folder; move a widget
to shared only after it is reused.

## 5. Dependencies policy

Keep dependencies minimal. Start with Flutter SDK only.

Potential additions, only if they materially improve the UI: -
`fl_chart` --- only for the dashboard task-completion chart if a custom
Flutter chart is too costly to reproduce accurately. - `intl` --- only
if date formatting needs more than simple built-in formatting. -
`google_fonts` --- avoid if the supplied fonts can be bundled locally;
use it only if local font assets are unavailable and runtime fetching is
acceptable for development.

Do not add state-management, networking, database, authentication,
calendar, animation, or icon packages for this UI-only milestone. Use
Flutter SDK features such as `ThemeData`, `ColorScheme`, `NavigationBar`
or a custom bottom bar, `AnimatedContainer`, `AnimatedSwitcher`, `Hero`,
`TweenAnimationBuilder`, `PageTransitionSwitcher` only if already
available without an added dependency, `showModalBottomSheet`, and
`AnimatedSize`.

Before adding any package, explain why the Flutter SDK cannot reasonably
handle the requirement. Avoid dependency sprawl.

------------------------------------------------------------------------

# 6. Build phases

Complete phases in order. At the end of every phase, run the app,
inspect it on a phone-sized emulator, fix layout issues, and only then
continue.

## Phase 1 --- Flutter foundation and design-system setup

**Goal:** Create a clean Flutter project foundation that supports the
exact DayFlow visual language.

Tasks: 1. Create the Flutter app using the stable Flutter SDK and enable
null safety. 2. Set up the folder structure gradually, starting with
`app/`, `core/theme/`, `core/constants/`, and `core/widgets/`. 3.
Configure app entry point, `MaterialApp`, theme mode, and a simple app
shell. 4. Add the provided font files locally and register them in
`pubspec.yaml`. 5. Implement centralized light/dark color tokens,
typography, radii, spacing, and component decoration helpers. 6. Add
reusable base components: card, section heading, icon button, search
field, status chip, and filter pill. 7. Configure safe areas, scrolling
defaults, keyboard insets, and responsive page padding.

**Acceptance criteria:** - App launches without errors. - Light and dark
themes render correctly using the exact supplied palette. - Typography
and reusable components look consistent. - No feature screen contains
scattered color literals or repeated styling. - No backend or external
connection exists.

## Phase 2 --- App shell, bottom navigation, and More screen

**Goal:** Build the shared mobile navigation and app-wide structure
before implementing feature details.

Tasks: 1. Implement the five bottom destinations: Home, Tasks, Projects,
Clients, More. 2. Match the reference navigation bar: selected item
background, icon, label, spacing, height, and corner treatment. 3.
Preserve navigation state locally and switch between placeholder feature
screens. 4. Create the shared page scaffold with consistent safe area,
background, scrolling, and bottom navigation spacing. 5. Build the More
screen with profile card, Analytics, Notifications, Account, Settings,
Workspace Portal, Client Portal, and theme selector. 6. Add simple local
visual states for selected tab and theme selection. Do not persist them.

**Acceptance criteria:** - Every primary destination is reachable from
the bottom bar. - The selected tab is visually obvious. - Content is not
hidden behind the bottom navigation or system gesture area. - More
screen matches the reference structure and spacing.

## Phase 3 --- Dashboard screen

**Goal:** Recreate the mobile Dashboard from the reference image.

Tasks: 1. Build the greeting header with user name, date, and supporting
illustration/asset where available. 2. Create responsive summary metric
cards for pending tasks, overdue tasks, active projects, and completed
tasks. 3. Build the task-completion chart card with month labels,
comparison line, legend, and summary values. 4. Build the todo list card
with task title, description, checkbox appearance, drag handle, and
overflow icon. 5. Add weekly insights and activity snapshot cards. 6.
Add the time-tracker card with timer display and start/reset visual
controls. Keep the timer static; no time-tracking logic. 7. Use dummy
data from `core/constants/sample_data/dashboard_data.dart`. 8. Ensure
the content scrolls naturally while the bottom navigation remains
available.

**Acceptance criteria:** - All dashboard sections from the web reference
are represented in a mobile-friendly hierarchy. - Cards maintain
consistent padding, borders, radius, and typography. - Chart is legible
at phone width and does not overflow. - Dummy values are sourced from
constants, not embedded in screen widgets.

## Phase 4 --- Tasks Calendar screen

**Goal:** Recreate the calendar and selected-day task list.

Tasks: 1. Build the screen heading and month navigation controls. 2.
Implement Month, Week, and Day visual selectors. 3. Create a responsive
month grid with weekday headings, date cells, selected-day styling, and
task-status dots. 4. Add the selected date header and task count. 5.
Build task cards showing time range, title, completion status, priority,
description, and overflow action. 6. Add the add-task visual action and
any simple local selected-date/view states required to demonstrate the
design. 7. Keep calendar and task sample records in `tasks_data.dart`.

**Acceptance criteria:** - Calendar cells align correctly across phone
widths. - Selected date and status dots match the reference visual
language. - Task cards remain readable without horizontal scrolling. -
Month/week/day controls show local selected states only; no scheduling
logic is implemented.

## Phase 5 --- Projects screen

**Goal:** Recreate project overview, filters, and project list.

Tasks: 1. Build the Projects heading, description, and New Project
visual action. 2. Create total, active, inactive, and client-project
summary cards. 3. Build the project search field and status/type filter
controls. 4. Create project list items with colored folder icon, project
name, client/organization, status chip, and overflow action. 5. Match
the desktop reference's content hierarchy while adapting it to a compact
mobile list/card layout consistent with the generated mobile reference.
6. Add pagination visuals only if they fit the mobile design; prefer a
simple list presentation over a cramped desktop-style table. 7. Keep
project records in `projects_data.dart`.

**Acceptance criteria:** - Project information is easy to scan on a
phone. - Search and filter controls fit without clipping. - Status chips
and project colors are consistent. - All displayed projects use dummy
constants.

## Phase 6 --- Clients screen

**Goal:** Recreate client overview and client directory.

Tasks: 1. Build the Clients heading, description, and New Client visual
action. 2. Create total, active, inactive, and portal-access summary
cards. 3. Add search, client status, and portal-access filter controls.
4. Display client company, contact, email, status, and overflow action
in a mobile-appropriate layout. 5. Preserve the reference's clean
directory appearance; avoid forcing a desktop table into a narrow
screen. 6. Use readable email wrapping or truncation and provide a clear
visual hierarchy. 7. Keep client records in `clients_data.dart`.

**Acceptance criteria:** - Client details remain readable at common
phone widths. - No row causes horizontal overflow. - Search and filter
controls have clear local visual states only. - Client sample data is
centralized.

## Phase 7 --- Daily Reminders screen

**Goal:** Recreate recurring reminder cards.

Tasks: 1. Build the Daily Reminders heading, supporting description, and
New Reminder visual action. 2. Create reusable reminder cards with
title, description, next reminder date/time, weekday chips, and overflow
menu. 3. Match active/inactive weekday styling, card spacing, and
typography from the reference. 4. Support varied card content lengths
without overflow. 5. Use reminder sample data from
`reminders_data.dart`. 6. Add local visual selection only if needed to
demonstrate weekday chips; do not implement recurrence or scheduling.

**Acceptance criteria:** - Reminder cards match the reference hierarchy
and visual style. - Weekday chips are consistent and legible. - Long
descriptions wrap naturally. - No real reminder scheduling or
notification behavior exists.

## Phase 8 --- Sign-in screen and shared overlays

**Goal:** Complete the visual entry screen and supporting UI surfaces.

Tasks: 1. Recreate the Sign in screen using the supplied web screenshot
as the reference for branding, typography, form layout, and demo prompt.
2. Adapt the split desktop composition into a mobile-first layout:
brand/illustration area, heading, fields, password visibility icon,
forgot-password link, sign-in action, Google visual action, demo action,
and create-account link. 3. Keep the demo credentials as display-only
sample text if they appear in the reference. Never submit or validate
them. 4. Build reusable bottom sheets, dialogs, menus, and
confirmation-style visual overlays needed by visible overflow/add
actions. 5. Ensure overlays respect safe areas, keyboard insets, and
dark/light themes. 6. Do not implement real authentication, account
creation, password reset, or Google sign-in.

**Acceptance criteria:** - Sign-in screen is visually consistent with
the supplied reference. - Mobile layout feels intentional and not like a
compressed desktop page. - Inputs can display typed text locally if
desired, but no submission or authentication occurs. - All overlays are
reusable and visually consistent.

## Phase 9 --- Polish, responsive QA, and delivery

**Goal:** Bring every screen to a consistent, production-quality UI
standard without adding backend functionality.

Tasks: 1. Compare every implemented screen side by side with the
supplied mobile reference image. 2. Correct spacing, font metrics, card
heights, icon alignment, border contrast, radii, and colors. 3. Test
small, medium, and large phone widths and at least one tablet width if
tablet support is in scope. 4. Check both light and dark themes on every
screen. 5. Verify scrolling, keyboard insets, safe areas, bottom
navigation, dialogs, and long text. 6. Add subtle, purposeful
transitions: - Animated selected bottom-tab state. - Short fade/slide
between screens where appropriate. - Smooth expansion for menus or
sections. - Subtle press feedback for tappable UI. - Small chart
entrance animation only if it remains smooth and does not distract. 7.
Keep animations short, consistent, and restrained. Avoid excessive
motion, bouncing, and animation packages. 8. Run `dart format .`,
`flutter analyze`, and `flutter test` (add basic widget smoke tests for
app launch and primary navigation). 9. Remove unused files,
dependencies, assets, debug UI, and starter template code. 10. Document
how to run the UI-only app.

**Acceptance criteria:** - All scoped screens render without overflow or
layout exceptions. - Light and dark modes are consistent. - Navigation
and visual controls work locally. - Animations remain smooth and do not
block interaction. - `flutter analyze` reports no unresolved issues. -
No backend, database, API, authentication, or external service
integration has been introduced.

------------------------------------------------------------------------

## 7. Flutter implementation best practices

### Widget composition

-   Keep screen widgets responsible for page layout and composition
    only.
-   Extract repeated cards, rows, headers, chips, and controls into
    focused widgets.
-   Prefer small private widgets in the same file for one-off pieces;
    create separate files for reusable or substantial components.
-   Use `const` constructors and `const` widget trees wherever possible.
-   Avoid passing many unrelated primitive parameters. Use small
    immutable view models when a component genuinely needs grouped data.
-   Keep business/domain architecture out of this UI-only project. Do
    not create repositories, data sources, services, or use cases for
    dummy content.

### Layout and responsiveness

-   Use `SafeArea`, `LayoutBuilder`, `MediaQuery`, `Flexible`,
    `Expanded`, and `SingleChildScrollView` appropriately.
-   Avoid fixed screen-wide dimensions. Use constraints and responsive
    spacing.
-   Use `ListView.builder` for longer sample lists.
-   Prevent nested unbounded scroll views. Choose one primary scroll
    direction per page.
-   Test with large text settings and ensure important actions remain
    accessible.
-   Do not place essential controls underneath the system gesture area.

### State

-   Use the simplest local state that fits the UI: `StatefulWidget` and
    `setState` for selected tabs, filters, theme preview, selected date,
    and other temporary presentation state.
-   Do not add Riverpod, Bloc, Provider, Redux, or another
    state-management dependency for this UI-only milestone.
-   Do not store user data or persist state between launches.

### Animations

-   Prefer Flutter's built-in implicit animations (`AnimatedContainer`,
    `AnimatedOpacity`, `AnimatedSwitcher`, `AnimatedSize`) for simple
    transitions.
-   Use explicit `AnimationController` only when a custom sequence
    genuinely requires it; dispose controllers correctly.
-   Respect reduced-motion/accessibility settings where practical.
-   Avoid running continuous animations unnecessarily.

### Accessibility

-   Maintain readable contrast in both themes.
-   Give icon-only controls semantic labels and adequate touch targets.
-   Do not communicate status using color alone; pair colors with
    text/icons.
-   Keep text scalable and support screen readers with meaningful
    labels.

### Code review checklist

Before completing each phase, confirm: - \[ \] Screen matches the
reference design and supplied theme tokens. - \[ \] Screen is split into
focused, maintainable widgets. - \[ \] Most component files are
approximately 120 lines or fewer. - \[ \] Sample data comes from
`core/constants/sample_data/`. - \[ \] No unnecessary dependency was
added. - \[ \] No network, database, backend, authentication, or
external connection exists. - \[ \] No overflow occurs on tested phone
widths. - \[ \] Light and dark themes both work. - \[ \] UI interactions
are local and presentation-only.

## 8. Final instruction for Claude Code

Build this project **phase by phase**, in the exact order above. First
inspect the attached reference images and this plan. Do not start by
generating the entire application in one pass.

At the beginning of each phase: 1. Briefly state the files and widgets
you intend to create or update. 2. Implement only that phase. 3. Run the
app and inspect the actual UI at phone dimensions. 4. Compare it
carefully against the reference image and fix visual mismatches. 5. Run
formatting and analysis. 6. Summarize what is complete and identify the
next phase. Wait for approval before proceeding to the next phase if the
user is reviewing work phase by phase.

**The supplied reference image is the visual specification. Match it as
closely and accurately as possible. Do not invent a new design. Do not
compromise the visual hierarchy or bottom-tab navigation.**

**This milestone is UI/UX only. Use constants and dummy data. Absolutely
no database, backend, APIs, authentication, networking, persistence, or
external service connections.**
