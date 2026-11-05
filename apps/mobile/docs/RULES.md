# Rules — DayFlow Mobile (Flutter)

Shared rules (database, RLS, secrets, redirects, brand copy): [docs/RULES.md](../../../docs/RULES.md). They win over this file. Structure and stack: [ARCHITECTURE.md](./ARCHITECTURE.md).

## Parity

- **The web app is the specification.** Same features, screens, fields, wording, statuses and behaviour, in both portals. Check `apps/web/src` when unsure, rather than guessing.
- Adapt only what a phone requires, in the way the web's own phone layout already does: tables become stacked cards, and the sidebar becomes a drawer.
- Features the web doesn't have aren't added without the owner's approval. Scheduled reminder alerts are the agreed exception to how the web fires them.

## Non-negotiable

- **Supabase only through `data/services/`.** Widgets and ViewModels never touch the Supabase client.
- **Table and column names live only in `data/services/db.dart`.**
- **No logic in widgets.** It goes in a ViewModel or a repository.
- **Models are immutable.** Changes make a new instance.
- **Colours through theme tokens only.** No `Color(0x...)` in widgets. A project's `color_hex` is the one exception.
- **Stored times stay display text**, such as "10:00 AM".

## UX behaviour (same as the web)

- Confirm every delete, naming what is deleted and what goes with it.
- Give feedback after every mutation, success or error. Never fail silently.
- Guard every form that can be dirty against losing unsaved changes.
- Every list and detail screen has loading, empty and error states. Loading uses a skeleton shaped like that screen.
- One primary action per screen. Row actions go in the three dots menu.
- Disable controls while saving.

## Design

- Follow [web DESIGN](../../web/docs/DESIGN.md) for look, layout and motion: warm paper surfaces, charcoal primary, one coral accent.
- Ovo for UI, Young Serif for headings, Merriweather for long text. Ovo and Young Serif have one weight, so never bold them.
- Check every screen in light and dark, from 310 wide up to tablet.
- Theme follows the device, and a manual choice is remembered on the device, never in the database.
- Tap targets are at least 48 by 48, even when the visible control is smaller. Label icon buttons with `Semantics` or a tooltip, support large text, and keep contrast at WCAG AA.
- Entrance motion goes through one shared widget. Respect the device's reduced motion setting.

## Code

- Follow [Effective Dart](https://dart.dev/effective-dart). Formatted with `dart format`, and `flutter analyze` stays clean.
- Files are `snake_case.dart`, classes `PascalCase`. Name classes by role: `ProjectsViewModel`, `ProjectsRepository`, `ProjectsService`.
- Shared widgets live in `ui/core/`. A feature never imports from another feature, except the shared client activities module.
- Keep widgets small by splitting them into widget classes, not helper methods that return widgets. Use `const` wherever possible.
- After an `await`, check `mounted` before using `BuildContext`.
- Smallest change that solves the problem. No speculative abstractions.

## Testing and checks

- Unit tests for every service, repository and ViewModel. Widget tests for screens, routing and forms. Use hand-written fakes.
- Before calling work done, run `dart format --set-exit-if-changed .`, `flutter analyze` and `flutter test`.
- Anything native (notifications, deep links, Google sign-in) has to be checked on a real device.

## Working

- Follow the owner's plan and update [TASKS.md](./TASKS.md) and [MEMORY.md](./MEMORY.md) when work lands.
- Never commit `env/dev.json`, signing keys or service account keys.
