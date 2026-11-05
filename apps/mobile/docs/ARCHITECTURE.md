# Architecture — DayFlow Mobile (Flutter)

A Flutter app for iOS and Android. The current milestone is **UI only**: local sample data, with no database, backend or accounts. The steps are in [DayFlow_Flutter_UI_Plan.md](./DayFlow_Flutter_UI_Plan.md).

**What decides the look:** `images/DayFlow Mobile App Showcase.png` first, then the plan, then the [web DESIGN](../../web/docs/DESIGN.md) for anything the image doesn't show.

## Stack for this milestone

Flutter SDK only. Local state uses `StatefulWidget` and `setState`, and animation uses Flutter's built-in implicit widgets. `fl_chart` and `intl` may be added only if the plan's dependency test is met. Fonts are bundled, and icons come from Material's outlined set.

## Folders

```text
apps/mobile/
  images/          app-icons, brand, icons, illustrations, the reference image
  fonts/           Ovo, Young Serif, Merriweather
  lib/
    main.dart
    app/           app.dart, app_shell.dart, navigation/
    core/
      constants/   strings, dimensions, assets, sample_data/
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

## Tokens

Colours come from `shared/brand/theme.json`. For this milestone they are copied once into `core/theme/app_colors.dart`, and nowhere else. A later step can generate that file from the JSON, as the web does for CSS.

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
