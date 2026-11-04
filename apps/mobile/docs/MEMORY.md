# Memory — DayFlow Mobile

Short facts for future sessions. Project-wide decisions: [docs/MEMORY.md](../../../docs/MEMORY.md).

- The old screens are at git tag `mobile-notifications-baseline`. Build that tag to run the baseline notification test.
- The only edits to preserved notification code: `applyReminderStatusFromNotification` calls `updateReminder` instead of Redux, the import path of the Supabase client in `expoPushTokensService.ts`, and `useTestNotification` (test-only, needed axios) stays in the vault, so its export left `index.ts`.
- `notificationPort.ts` passes "done" reminders to the scheduler as "upcoming". The scheduler skips "done", which dropped that reminder's whole week until the app reopened. Status only tracks today, and `statusForSchedule` only allows "done" after today's time has passed, so this can't double-fire.
- `reminderMapper.ts` now treats `is_disabled` as paused unless `disabled_until` has arrived, because the web disables without setting `status`. Without this a web-disabled reminder would still fire on the phone.
- Reminder services (`reminderMapper`, `remindersService`, `reminderOccurrencesService`, `reminderDay`) came from the old app as they were proven. `reconcileReminderStatuses` closes out past days and writes to the database when reminders load, as the old app did.
- iOS keeps only the soonest 64 pending local notifications and the scheduler makes up to 7 per reminder. The soonest always stay and every open reschedules, so this mostly matters to someone with 10 or more daily reminders who rarely opens the app. Not changed.
- Times are stored as display text, "10:00 AM". The env var is `EXPO_PUBLIC_SUPABASE_KEY`.
- The reminders section stays off the Today screen and there's no large clock, at the owner's request. The AI Assist tab was a simulation and is gone (in git at the tag).
- NativeWind: `Animated.View` needs the `cssInterop` in `ThemeProvider`; `Image` needs `style` for its size, not classes.
- `bun run web` is good for checking screens, but it logs nested-button warnings for rows with a checkbox and alerts become `window.confirm`. Those are web-only.
- The legacy Vercel backend (`day-flow-backend-63tp.vercel.app`) and axios are no longer used.
