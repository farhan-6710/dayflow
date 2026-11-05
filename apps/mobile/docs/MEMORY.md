# Memory — DayFlow Mobile

Short facts for future sessions. Project-wide decisions: [docs/MEMORY.md](../../../docs/MEMORY.md).

## Status

- 2026-11-05: the owner chose Flutter and removed the Expo app. The new app must do exactly what the web app does. The build plan is still to come.

## The old Expo app

- Its last commit is `54903a4`. Read any file with `git show 54903a4:apps/mobile/<path>`, or list them with `git ls-tree -r 54903a4 --name-only apps/mobile`. It was never released to a store.
- Useful files to read there: `scripts/generate-brand-assets.py` (app icons), `assets/sounds/notification_sound.wav`, and `src/services/` for the reminder logic below.
- `.env.local` and `google-services.json` were untracked and are gone. The Supabase values are the same as in `apps/web/.env`. Re-download `google-services.json` from Firebase if push resumes.

## What it learned that still applies

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
- Illustrations weren't kept here because the web has identical copies in `apps/web/public/images/dayflow/illustrations/`.
- If the logo changes, the icons need regenerating. Start from the old script above.

## Decisions for the owner

- **App id.** The old one was `dev.expo.personalassistantapp`. Nothing was released, so it can change freely now, and it's hard to change after a store release. Suggested: `com.dayflow.mobile`.
- **Reminder Done and Missed.** The Expo app had notification action buttons, status tracking and reminder history. The web has none of these screens, so "exactly the web" would drop them.
- **`expo_push_tokens`.** Flutter has no Expo push token. The table stays as it is, since the database is never changed, and is left unused while push is on hold. If push resumes, decide between storing FCM tokens or using Expo's push service another way.
