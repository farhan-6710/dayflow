# Tasks — DayFlow (mobile)

`[x]` done · `[ ]` to do. What the UI covers: [DESIGN.md](./DESIGN.md) · Structure: [ARCHITECTURE](./ARCHITECTURE.md).

## Done

- [x] Expo app removed; Flutter app created (`apps/mobile`)
- [x] Phase 1: foundation and design system (theme, text styles, dimensions)
- [x] Phase 2: app shell, bottom navigation, drawer, More
- [x] Phase 3: Dashboard
- [x] Phase 4: Tasks Calendar
- [x] Phase 5: Projects
- [x] Phase 6: Clients
- [x] Phase 7: Daily Reminders
- [x] Phase 8: Sign in and shared overlays
- [x] Phase 9: polish and smoke tests across phone sizes, both themes and large text (`test/app_test.dart`)
- [x] Brand copy read from the generated `brand_manifest.dart` (source: root `brandManifest.json`)
- [x] Docs moved to `docs/mobile/`; `UI_SPEC.md` renamed to `DESIGN.md`

## Needs the owner

- [ ] Review every screen against the reference image
- [ ] Replace `images/illustrations/hero-plant-cup.png` (cut from the reference, so soft) with final art
- [ ] Android tools: `flutter doctor` reported cmdline-tools missing and licenses not accepted, so Android has not been built. Build and check on Android and real devices
- [ ] Decide the open items in [MEMORY.md](./MEMORY.md) (app id, reminder Done / Missed, `expo_push_tokens`) before the database is connected

## Later

- [ ] Connect Supabase, auth and real data, per [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Generate `app_colors.dart` from `shared/brand/theme.json`. Then decide whether to stop generating `shared/brand/theme.ts`, an Expo-era file nothing imports
- [ ] Move remaining UI strings in `core/constants/app_strings.dart` into the manifest only if they are brand copy (name, tagline, portal labels already are)
- [ ] Scheduled reminder alerts
- [ ] On hold, needs a server or a database change: push between client and owner when an activity is raised or changed; updating a phone's reminders while the app is closed
