# Memory — DayFlow Mobile

Short facts for future sessions. Project-wide decisions: [docs/MEMORY.md](../../../docs/MEMORY.md).

## Status

- 2026-11-05: the owner chose Flutter and removed the Expo app. The first milestone is UI only, matching `images/DayFlow Mobile App Showcase.png`, following `DayFlow_Flutter_UI_Plan.md`. The database comes later.
- 2026-11-05: UI phases 1 to 9 built and checked on an iPhone 16e simulator (390 wide). Android hasn't been built.
- The reference image's paper colour looks warmer than `theme.json`. The plan makes the tokens the source of truth, so the app uses the tokens.
- `tileWarm` and `tileAmber` are the only colours not in `theme.json`. The reference needs them for icon tiles.
- Young Serif's default numbers dip below the line, so `app_text_styles.dart` turns on lining figures. Without it, "14" looks wrong beside the reference.
- Flutter's default theme adds letter spacing, so the styles set it to 0.
- A new asset file needs a full `flutter run`, because hot restart doesn't pick it up.
- Widget tests must load the real fonts (see `test/app_test.dart`), or they measure a blocky test font and report false overflows.
- Bundle id is `com.dayflow.dayflow` for now. It's still an open decision below.

## The old Expo app

- Its last commit is `54903a4`. Read any file with `git show 54903a4:apps/mobile/<path>`, or list them with `git ls-tree -r 54903a4 --name-only apps/mobile`. It was never released to a store.
- Useful files to read there: `scripts/generate-brand-assets.py` (app icons), `assets/sounds/notification_sound.wav`, and `src/services/` for the reminder logic below.
- `.env.local` and `google-services.json` were untracked and are gone. The Supabase values are the same as in `apps/web/.env`. Re-download `google-services.json` from Firebase if push resumes.

## What it learned, for when the database is connected

- The `reminders` table uses `title`, `reminder_time` ("10:00 AM") and `days_of_week`, so parse the time text to schedule alerts.
- A reminder with `is_disabled` counts as off until `disabled_until` has passed. The web turns reminders off without setting `status`, so a phone must check this or a disabled reminder will still fire.
- Sign-out must clear the phone's scheduled alerts, so it stops alerting for that account.
- Local alerts only know about reminders from the last time the app opened. Reminders added on the web don't fire until the phone opens the app.
- One user's phone can't read another's push token or create their notifications because of RLS, so push between client and owner needs a server.
- The public demo account also has to work on mobile, and app review can use it.

## Images

- `images/app-icons/`: launcher and splash source files, with light, dark and tinted iOS variants and Android adaptive layers.
- `images/brand/`: logo marks.
- `images/icons/`: 3D empty-state icons, identical to the web's. The web has more, in `apps/web/public/images/dayflow/icons/`.
- `images/illustrations/`: copied from `apps/web/public/images/dayflow/illustrations/` as screens need them.
- `images/DayFlow Mobile App Showcase.png`: the visual specification. It isn't bundled in the app.
- If the logo changes, the icons need regenerating. Start from the old script above.

## Decisions for the owner, before the database is connected

- **App id.** The old one was `dev.expo.personalassistantapp`. Nothing was released, so it can change freely now, and it's hard to change after a store release. Suggested: `com.dayflow.mobile`.
- **Reminder Done and Missed.** The Expo app had notification action buttons, status tracking and reminder history. The web has none of these screens, so "exactly the web" would drop them.
- **`expo_push_tokens`.** Flutter has no Expo push token. The table stays as it is, since the database is never changed, and is left unused while push is on hold. If push resumes, decide between storing FCM tokens or using Expo's push service another way.
