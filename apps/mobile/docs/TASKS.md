# Tasks — DayFlow Mobile (Flutter)

`[x]` done · `[ ]` to do · `[~]` on hold or blocked. Details of each phase: [DayFlow_Flutter_UI_Plan.md](./DayFlow_Flutter_UI_Plan.md).

## Setup

- [x] Expo app removed
- [x] Docs updated for the UI-only plan, and the plan checked against the reference image
- [x] Disk space freed, Flutter 3.47.9 installed
- [ ] Android tools: `flutter doctor` reports cmdline-tools missing and licenses not accepted, so Android hasn't been built yet

## UI milestone

- [x] Phase 1: foundation and design system
- [x] Phase 2: app shell, bottom navigation, drawer, More
- [x] Phase 3: Dashboard
- [x] Phase 4: Tasks Calendar
- [x] Phase 5: Projects
- [x] Phase 6: Clients
- [x] Phase 7: Daily Reminders
- [x] Phase 8: Sign in and shared overlays
- [x] Phase 9: polish, checks and delivery

## Before the UI is final

- [ ] Owner's review of every screen against the reference
- [ ] Replace `images/illustrations/hero-plant-cup.png` (cut from the reference, so soft) with final art
- [ ] Build and check on Android and real devices

## Later milestone: connect the database

- [ ] Connect Supabase, auth and real data, per [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Generate Dart tokens from `shared/brand/theme.json`, then remove `theme.ts`
- [ ] Scheduled reminder alerts
- [ ] Decide the items in [MEMORY.md](./MEMORY.md)

## On hold (needs a server or a database change)

- [~] Push between client and owner when an activity is raised or changed
- [~] Updating a phone's reminders while the app is closed
