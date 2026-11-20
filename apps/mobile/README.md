# DayFlow Mobile

The DayFlow app in Flutter, for iOS and Android. This is a **UI-only preview**: all content is sample data, and nothing connects to a database, account or network.

## Run it

Needs Flutter (stable) and Xcode for iOS or Android Studio for Android.

```bash
flutter pub get
```

```bash
flutter run
```

## Check it

```bash
dart format .
```

```bash
flutter analyze
```

```bash
flutter test
```

## Good to know

- The sign-in buttons just open the app, and Sign out in the drawer returns to them.
- Save and Delete show a message and change nothing.
- Daily Reminders opens from the menu icon at the top left.

Docs are in [docs/](../../docs/mobile/): the [design](../../docs/mobile/DESIGN.md), [architecture](../../docs/mobile/ARCHITECTURE.md), [rules](../../docs/mobile/RULES.md), [tasks](../../docs/mobile/TASKS.md) and [memory](../../docs/mobile/MEMORY.md).
