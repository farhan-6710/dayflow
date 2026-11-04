# Rules — DayFlow Mobile

Shared rules (database, RLS, secrets, redirects, brand copy): [docs/RULES.md](../../../docs/RULES.md).

## Notifications are frozen

The setup in `src/notifications/`, `src/services/localReminderScheduler.ts` and `src/services/expoPushTokensService.ts` came from `_vault/notifications/` and works. Never change the channel `custom_channel`, sound `notification_sound.wav`, category `custom_category`, actions `action_done` and `action_missed`, schedule ids `dayflow-reminder:<id>:<day>`, data `{ reminderId }`, or the route `/reminder-details/[id]`. Android fixes a channel's sound when it is first created. New kinds of alert get a new channel. Screens reach notifications only through `src/features/reminders/notificationPort.ts`. Don't edit `_vault/`.

## Structure

- `app/` holds thin routes. `(auth)` sign-in flow, `(owner)` workspace, `client/` client portal.
- `src/features/<feature>` owns screens' parts and hooks. `src/services` holds every Supabase call, with names in `services/db.ts`. `src/ui` is the design system.
- Data flow: screen → hook (React Query) → service → Supabase. Every mutation uses `useAction`, which gives feedback and refreshes data.

## UX

- Colours through tokens only (`shared/brand/theme.json`); a project's `color_hex` is the one exception. Status colours as in the web's DESIGN.md.
- Ovo for UI, Young Serif for headings, Merriweather for notes. These are single-weight or fixed fonts: never `font-bold`.
- Every data screen has a skeleton shaped like it, an `EmptyState` and an `ErrorState` (`QueryState` does this).
- One primary action per screen: `Fab` or a bottom button. Row actions are `SwipeRow` (swipe or long press), never kebabs on rows.
- Forms use `FormSheet`, which handles saving state, inline errors and unsaved edits. Full-screen forms use `useUnsavedGuard`.
- Fields that expand (`DateField`, `TimeField`, `SelectField`) open in place. Don't stack modals: a second RN Modal won't show over the first on iOS. Use `confirm()` for questions over a sheet.
- Deletes go through `confirm()` and name what goes with them.
- Works at 320pt wide, in light and dark. 44pt targets, labelled controls.

## Checks

`bunx tsc --noEmit`, `bunx eslint .`, `bunx expo export --platform android --platform ios`. Screens can be checked with `bun run web`, but anything native (notifications, haptics, Google, deep links) needs a device build.
