# Architecture — DayFlow (mobile)

A Flutter app for iOS and Android. The current milestone is **UI only**: local sample data, with no database, backend or accounts. What to build: [DESIGN.md](./DESIGN.md). Shared product and data: [PRD](../PRD.md).

## Stack for this milestone

Flutter SDK only. Local state uses `StatefulWidget` and `setState`, and animation uses Flutter's built-in implicit widgets. No packages yet beyond `flutter_lints`; see the dependency rule in [DESIGN.md](./DESIGN.md#dependencies). Dart SDK `^3.13.7` (`pubspec.yaml`), Material 3. Fonts (Ovo, Young Serif) are bundled, and icons come from Material's outlined set. No env vars or config files.

## Folders

```text
apps/mobile/
  images/          app-icons, brand, icons, illustrations, the reference image
  fonts/           Ovo, Young Serif
  lib/
    main.dart
    app/           app.dart, app_shell.dart, navigation/
    core/
      constants/   strings, dimensions, assets, brand_manifest.dart (generated), sample_data/
      theme/       colours, text styles, theme, theme extension
      utils/
      widgets/     shared base components
    features/
      auth/ dashboard/ tasks/ projects/ clients/ reminders/ more/
        screens/   page composition only
        widgets/   that feature's pieces
    shared/        models/, and widgets used by more than one feature
  test/            smoke tests across phone sizes, both themes and large text
```

Create a folder only when a real file needs it. Move a widget to `shared/` only once a second feature uses it.

## State and data flow

`DayFlowApp` holds the theme mode and the signed-in flag in `setState`. Screens read sample data from `core/constants/sample_data/` and models from `shared/models/`. Nothing is persisted.

## Tokens and brand

Colours come from `shared/brand/theme.json`. For this milestone they are copied once into `core/theme/app_colors.dart`, and nowhere else. A later step can generate that file from the JSON, as the web does for CSS.

Brand copy comes from `lib/core/constants/brand_manifest.dart`. It is generated from the root `brandManifest.json` by `bun run brand:generate` in `apps/web` (Flutter cannot import JSON from outside its package, so the generated file is the bridge). Do not edit it by hand.

## Deploy

Not released. Bundle id is `com.dayflow.dayflow` for now (see [MEMORY.md](./MEMORY.md)).

## When the database is connected (later milestone)

Not part of this milestone. Add a data layer without rewriting the screens, following [Flutter's architecture guide](https://docs.flutter.dev/app-architecture/recommendations):

| Need | Likely choice |
|------|---------------|
| Backend and auth | `supabase_flutter`, with `flutter_secure_storage` for the session |
| State | `flutter_riverpod` |
| Navigation | `go_router` |
| Models | `freezed`, `json_serializable` |
| Reminder alerts | `flutter_local_notifications`, `timezone`, `flutter_timezone` |
| Data flow | View → ViewModel → Repository → Service → Supabase |

The redirect stays `dayflow://auth/callback`, and table and column names go in one `db.dart`. Env values use `--dart-define-from-file`, with only the publishable key ever in the app. Push stays on hold because it needs a server.
