# Architecture — DayFlow Mobile (Flutter)

A Flutter app for iOS and Android that does exactly what the web app does, on the same Supabase project. No code exists yet. The owner will supply the build plan.

The web app is the specification: [web ARCHITECTURE](../../web/docs/ARCHITECTURE.md), [web DESIGN](../../web/docs/DESIGN.md), and the code in `apps/web/src`. Shared rules: [docs/RULES.md](../../../docs/RULES.md). Data: [docs/DATABASE.md](../../../docs/DATABASE.md).

The structure follows [Flutter's architecture guide](https://docs.flutter.dev/app-architecture/recommendations): separate UI and data layers, MVVM, repositories, immutable models and one-way data flow.

## Stack

Use the latest stable Flutter when the project is created, and commit `pubspec.lock`.

| Need | Choice | Why |
|------|--------|-----|
| Backend and auth | `supabase_flutter` | The same Auth, Postgres and RLS as the web |
| Session storage | `flutter_secure_storage` | Through Supabase's `LocalStorage` option. The default is plain `shared_preferences` |
| State and dependency injection | `flutter_riverpod`, without its code generator | `AsyncValue` gives every screen its loading, error and data states, and providers can be swapped for fakes in tests |
| Navigation | `go_router` | Flutter's recommended router. Redirects act as the route guards, and shell routes hold the app shell |
| Models | `freezed`, `json_serializable`, `build_runner` | Immutable models with `fromJson` and `copyWith` |
| Reminder alerts | `flutter_local_notifications`, `timezone`, `flutter_timezone` | Scheduled on the device, so no server is needed |
| Charts | `fl_chart` | Replaces recharts |
| Skeletons | `skeletonizer` | Shimmers over the real widget, as phantom-ui does on the web |
| Entrance motion | `flutter_animate` | Blur, slide and fade with the timings in web DESIGN |
| Icons | `lucide_icons_flutter` | The same icon set as the web |
| Dates | `intl` | Replaces date-fns |
| Theme choice | `shared_preferences` | Remembers the manual light or dark choice on the device |
| Links | `url_launcher` | Reference links, email, phone |
| App icon and splash | `flutter_launcher_icons`, `flutter_native_splash` | Built from `images/app-icons/` |
| Checks | `flutter_lints`, `flutter_test`, `integration_test` | The standard tools, using hand-written fakes |

Don't add a package when the SDK does the job: `ReorderableListView` for drag to reorder, and `SnackBar` through one helper for toasts. The calendar is built by hand, as it is on the web. Fonts are bundled as assets rather than downloaded at runtime.

## Web to Flutter

| Web | Flutter |
|-----|---------|
| Page, hook, service | View, ViewModel (Riverpod `Notifier`), repository, service |
| `services/db.ts` | `data/services/db.dart`: every table and column name |
| `router.tsx`, route guards | `routing/router.dart`, `go_router` redirects |
| `AppShellLayout` | One `AppShell` widget, configured per portal with nav items and quick action |
| Sidebar on desktop, sheet on phones | A `NavigationRail` on tablets and a `Drawer` on phones |
| Tailwind tokens | `ThemeData` plus a `ThemeExtension` for tokens Material doesn't have |
| `Phantom` | `Skeletonizer` wrapping the real widget |
| `DirectoryTable` | One shared list widget: rows on tablets, stacked cards on phones |
| `ConfirmationModal`, `FormDialog` | Shared dialog widgets, in `ui/core` |
| `useDialogForm` unsaved guard | A shared form guard using `PopScope` |
| Reminder alerts on a browser timer | Scheduled local notifications |

## Folders

Created when the project starts. UI is grouped by feature and data by type, as Flutter's guide recommends.

```text
apps/mobile/
  images/                   app-icons, brand, 3D icons (add illustrations from the web)
  fonts/                    Ovo, Young Serif, Merriweather
  env/                      dev.json is untracked; example.json is committed
  lib/
    main.dart
    config/                 env, generated theme and brand values
    routing/                router.dart, route constants
    domain/models/          immutable models
    data/
      services/             db.dart and every Supabase call, one file per domain
      repositories/         abstract repository plus its Supabase implementation
    notifications/          scheduling, channels, permission and tap handling
    ui/
      core/                 theme, AppShell, shared widgets
      workspace/<feature>/  view_models/ and widgets/
      client/<feature>/     view_models/ and widgets/
  test/                     unit and widget tests, with fakes in test/fakes/
  integration_test/
```

## Data flow

`View` → `ViewModel` → `Repository` → `Service` → Supabase. Data flows up and events flow down, in one direction only.

- **View:** layout and simple conditions only, with no logic.
- **ViewModel:** one per screen. Holds the screen's state and handles its actions.
- **Repository:** the source of truth for a domain. Maps rows to models and owns caching.
- **Service:** a thin wrapper around Supabase calls, with no state.

Repositories are abstract so tests can use fakes. Add a domain or use-case layer only if logic starts repeating across ViewModels.

## Shared tokens and copy

`shared/brand/theme.json` and `brandManifest.json` stay the single source. Flutter can't read assets outside its package, so `apps/web/scripts/generate-theme.mjs` is to be extended to write the Dart values to `lib/config/`. `shared/brand/theme.ts` has no reader now that the Expo app is gone, so remove it in that same change.

## Config

- **Env:** `flutter run --dart-define-from-file=env/dev.json` with `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`. These values end up inside the app, so only the publishable key ever goes there.
- **Auth redirect:** `dayflow://auth/callback`, already on the Supabase allow list. Google sign-in uses `signInWithOAuth` with this redirect, so Supabase and Google need no changes. Set up the scheme on both platforms for the `app_links` package that `supabase_flutter` uses.

## Notifications

- Every enabled reminder gets a weekly local notification per repeat day, using `zonedSchedule` with `matchDateTimeComponents`.
- Android needs its exact alarm permission and boot receiver set up, and iOS keeps a limit of 64 pending notifications. Reschedule when the app opens and when reminders change.
- Android fixes a channel's sound when the channel is first created. To change a sound, use a new channel.
- Push is on hold. It needs a server, and `firebase_messaging` would be added at that point.
