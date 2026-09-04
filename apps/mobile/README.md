# DayFlow mobile

Expo (React Native) app. Same Supabase Auth + Postgres as web and desktop — same demo login, same `reminders` rows.

Product overview: [docs/README.md](../../docs/README.md). Shared schema: [docs/DESIGN.md](../../docs/DESIGN.md).

## Setup

```bash
cd /Users/farhan/my-work/my-projects/dayflow/apps/mobile
npm install
```

`.env.local` (do not commit):

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_KEY=
```

Same project as web `VITE_SUPABASE_*`. Release APKs get these from the EAS **preview** environment, not from `.env.local`.

## Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Expo dev server |
| `npm run start:clear` | Dev server, clear cache |
| `npm run android` / `npm run ios` | Native run |
| `npm run type-check` | `tsc --noEmit` |

## Preview Android build (EAS)

```bash
cd /Users/farhan/my-work/my-projects/dayflow/apps/mobile
eas build --profile preview --platform android --clear-cache
```

- Profile `preview` → internal APK (`eas.json`)
- iOS: coming soon (needs Apple Developer + registered devices)
- Pass `google-services.json` via EAS file env if it is not in git
- Install link is per-build on [expo.dev](https://expo.dev) — update [docs/README.md](../../docs/README.md) when you ship a new APK

## Icons & splash

Source logos: `apps/web/public/logo-light-icon.png` and `logo-dark-icon.png`.

```bash
cd /Users/farhan/my-work/my-projects/dayflow/apps/mobile
python3 scripts/generate-brand-assets.py
```

Writes `assets/icon.png`, `assets/icons/*`. Adaptive icons need extra inset (Android only shows the center ~67%).

## Layout

```text
app/                      Expo Router screens
src/lib/supabase.ts       createClient (AsyncStorage)
src/services/             reminders, occurrences, Expo push tokens
src/services/db.ts        Table names (same Postgres as web)
scripts/generate-brand-assets.py
```

Do not add a second database. Migrations live in repo `scripts/migrations/` (028–029 are mobile reminder/push fields).
