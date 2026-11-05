# Rules — DayFlow Mobile (Flutter)

Shared rules: [docs/RULES.md](../../../docs/RULES.md). They win over this file. Steps: [DayFlow_Flutter_UI_Plan.md](./DayFlow_Flutter_UI_Plan.md). Structure: [ARCHITECTURE.md](./ARCHITECTURE.md).

## This milestone is UI only

- No database, Supabase, API, HTTP, Firebase, sign-in, notifications, analytics or persistence.
- Sample data lives in `core/constants/sample_data/`, never inside widgets.
- Interactions are local and only demonstrate the UI.

## Match the reference

- `images/DayFlow Mobile App Showcase.png` is the visual specification: layout, spacing, sizes, type, icons, cards and navigation. Don't redesign it.
- Where the plan and the image differ, the image wins (section 0 of the plan lists these).
- Compare each screen with the image before finishing its phase, and fix mismatches.
- The phone frames, status bars and top banner in the image are presentation only, and aren't built.

## Code

- Clean, beginner-friendly Dart. Widget files stay around 120 lines. Screens only compose widgets.
- Split into widget classes, not helper methods that return widgets. Use `const` wherever possible.
- Models are immutable.
- Colours, radii and spacing come from `core/theme` and `core/constants`. No colour literals in features.
- No package unless the plan's dependency test is met.
- Files are `snake_case.dart`, classes `PascalCase`. Follow [Effective Dart](https://dart.dev/effective-dart).

## UX

- Check every screen in light and dark, from 310 wide up to large phones, with no overflow.
- Tap targets are at least 48 by 48, even when the visible control is smaller. Label icon buttons for screen readers.
- Status is never shown by colour alone.
- Ovo and Young Serif have one weight, so never bold them.
- Motion is short and restrained, and respects reduced motion.

## Each phase

1. Say which files change, and build only that phase.
2. Run it on a phone simulator and compare it with the image.
3. Run `dart format .` and `flutter analyze`.
4. Update [TASKS.md](./TASKS.md) and [MEMORY.md](./MEMORY.md), and state what's done and what's next.
