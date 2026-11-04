# Tasks — DayFlow Mobile

`[x]` done · `[ ]` to do · `[~]` on hold. Phases are from [MOBILE_REBUILD_PLAN.md](./MOBILE_REBUILD_PLAN.md).

- [x] Phase 0: tag `mobile-notifications-baseline`, branch, notification vault
- [x] Phase 1: foundation, theme from `theme.json`, services, UI kit
- [x] Phase 2: navigation shell, sign in, sign up, reset, Google, demo, role, not-a-client
- [x] Phase 3: Today, todos, time tracker, tasks calendar
- [x] Phase 4: reminders, details, history
- [x] Phase 5: projects, notes, reference links
- [x] Phase 6: clients, shared activities, conversation
- [x] Phase 7: client portal
- [x] Phase 8: analytics, inbox, profile, settings
- [x] Phase 9: notification system restored behind the port
- [x] Phase 10: new-activity indicators in the app

## Needs the owner, on real devices

- [ ] New development build (the `dayflow` scheme and `expo-web-browser` are native changes), then the notification test in the plan, section 4.3
- [ ] Google sign-in and the password-reset link on a device
- [ ] Client portal with a real client login
- [ ] Both directions of activities with two real accounts
- [ ] Decide on the Expo patch updates (`expo-doctor` lists 15, including `expo-notifications`) and Xcode 26.4 or later for iOS builds
- [ ] EAS preview build, internal testing, store submission (Phase 12)

## On hold (needs a server or a database change)

- [~] Push between client and owner when an activity is raised or changed
- [~] Background resync of reminders created on the web while the app is closed

## Later

- [ ] Drag to reorder (reorder mode uses up and down buttons today)
- [ ] Offline cache across app restarts
- [ ] Automated tests
