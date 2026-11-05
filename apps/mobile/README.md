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

Docs are in [docs/](./docs/): the [plan](./docs/DayFlow_Flutter_UI_Plan.md), [architecture](./docs/ARCHITECTURE.md), [rules](./docs/RULES.md), [tasks](./docs/TASKS.md) and [memory](./docs/MEMORY.md).
