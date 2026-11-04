# DayFlow Mobile: Rebuild Plan

Status: built on branch `mobile-rebuild`, see [TASKS.md](./TASKS.md) for what still needs real devices. Approved direction: **No custom backend or server: the app talks to Supabase only.** Anything that needs our own backend is on hold (section 5).
Written 2026-11-04 from the repository (`apps/mobile`, `apps/web`, `scripts/migrations`) and `docs/WEB_HANDOFF_FOR_MOBILE.md`.

This plan rebuilds the entire mobile app to cover every screen the web app has, designed for phones rather than copied from the web, while **keeping the existing push and reminder notification setup untouched** and restoring it after the app is built.

---

## 1. Goals and non-goals

**Goals**
1. Mobile has feature parity with the web app, for both roles: the workspace owner and the client.
2. Every screen follows mobile best practice (thumb reach, bottom navigation, sheets, swipe actions, pull to refresh, safe areas, dark mode), not a shrunken web layout.
3. The notification system that works today (sound, channel, action buttons, token registration, local scheduling) survives the rebuild **unchanged** and is reattached at the end.
4. Every reminder produces a notification.
5. Activities raised by a client or by the owner are fully visible to the other side in the app (shared Supabase data). **Push notifications between the two are ON HOLD** because they need a server (section 9.2).

**Non-goals**
- No database changes and **no backend server**. Features that need either are on hold (section 9.2), not built in a reduced form.
- No new product features beyond web parity (and the notification requirements above).
- The current mock "AI Assist" tab has no web equivalent and is not part of parity (see D8).

---

## 2. Non-negotiable rules

1. **The database never changes** from app work. RLS is the access contract. The owner applies migrations by hand.
2. **The notification setup is frozen** (section 4). It is moved to a safe place first, and restored only in Phase 9.
3. **Supabase is reached only through a services layer**, and table and column names live in one file (`services/db.ts`), as on the web.
4. **No secrets in git.** `.env.local`, `google-services.json` handling stay as they are today.
5. **App identity does not change**: bundle id and Android package `dev.expo.personalassistantapp`, EAS project `ce9d820f-d43a-44e0-bd40-e8a3b71422b6`. Changing either breaks the push token and store continuity.
6. UX rules carried over from the web: loading, empty and error states on every screen; every delete confirmed and says what goes with it; feedback after every mutation; controls disabled while saving; guard against losing unsaved edits.
7. Theme comes from `shared/brand/theme.ts` (generated from `theme.json`). No hard-coded colours.

---

## 3. What exists today (audit)

### 3.1 Stack

| Area | Current |
|------|---------|
| Framework | Expo 57, React Native 0.86, React 19, expo-router (file routes), TypeScript |
| Styling | NativeWind 4 on Tailwind 3. `tailwind.config.js` holds the **old gold palette** |
| State | Redux Toolkit, redux-persist, redux-saga (reminders only), React Query |
| Data | Supabase JS for reminders, occurrences and push tokens. An `axios` client points at `BASE_URL` |
| Auth | Supabase Auth, session stored in AsyncStorage |
| Fonts | Cinzel (`@expo-google-fonts/cinzel`), not the web's Ovo, Young Serif and Merriweather |
| Identity | App name DayFlow, EAS project configured, `google-services.json` present |
| Missing | No `scheme` in `app.json`, so `dayflow://` deep links are not configured |

### 3.2 Screens today
Tabs: Home, History, Analytics, AI Assist (simulated, no real logic), Profile. Auth: login, signup. Reminder details `/reminder-details/[id]`. Only **reminders** exist as a feature.

### 3.3 Notification system inventory (everything to preserve)

| File / setting | Role |
|----------------|------|
| `src/notifications/constants.ts` | Sound `notification_sound.wav`, Android channel `custom_channel`, category `custom_category` |
| `src/notifications/expoNotifications.ts` | Wrapper around `expo-notifications` with an **Expo Go Android shim** (the real module throws there). Everything must import it, never `expo-notifications` directly |
| `src/notifications/context/NotificationProvider.tsx` | Asks permission, registers categories, gets the token, attaches the response listener |
| `src/notifications/hooks/useRegisterDFN.ts` | Stores the Expo push token after registration |
| `src/notifications/hooks/useTestNotification.ts` | Sends a test push through Expo's push API |
| `src/notifications/utils/registerForPushNotificationsAsync.ts` | Physical device check, EAS project id, `getExpoPushTokenAsync` |
| `src/notifications/utils/notificationUtils.ts` | `setupNotifications`, action buttons **Done** and **Missed**, received and tap listeners, tap opens `/reminder-details/:id` |
| `src/notifications/index.ts` | Public exports |
| `src/services/localReminderScheduler.ts` | Schedules **weekly local notifications**, one per reminder per weekday, id `dayflow-reminder:<id>:<day>`, skipping paused and done |
| `src/services/expoPushTokensService.ts` | Upserts into `expo_push_tokens` on conflict `token` |
| `app/_layout.tsx` (part) | `setNotificationHandler` and creation of the Android channel `custom_channel` (HIGH importance, vibration, sound) |
| `app.json` | `expo-notifications` plugin with icon `ios-tinted.png` and sound file; `googleServicesFile` |
| `assets/sounds/notification_sound.wav` | The notification sound |
| `tsconfig.json`, `babel.config.js` | Path aliases the preserved code imports: `@notifications`, `@services`, `@types`, `@redux` |

### 3.4 Couplings to be aware of
- `notificationUtils.ts` imports the Redux `store` and `updateReminderRequest` to apply **Done / Missed** from a notification. The rebuild drops Redux, so this is the **one planned edit** to preserved code (section 4.4).
- `localReminderScheduler.ts` takes the mobile `Reminder` shape (`name`, `hour`, `minute`, `repeatDays`, `status`). The new reminders feature must keep that shape (or provide a mapper) at the scheduling boundary.
- Android channel sound is fixed when the channel is first created. **Do not rename `custom_channel` or change its sound**, or existing installs keep the old behaviour and new ones differ.

### 3.5 Finding: a legacy backend exists
`src/config/config.ts` points `BASE_URL` at `https://day-flow-backend-63tp.vercel.app`, with routes for auth, reminders and `store_expo_token`. Its code is **not in this repository**, and the app now reads and writes reminders through Supabase directly. I cannot see whether it is alive or what it holds (for example a Supabase service key). This matters for D1. (The earlier handoff file said there was no custom backend; that is corrected here. The mobile app will **not** call it.)

---

## 4. Notification preservation: "the vault"

### 4.1 Freeze, then move to a safe place (Phase 0)
1. Create the git tag **`mobile-notifications-baseline`** on the current commit, and a branch **`mobile-rebuild`** for all work.
2. Copy every file in section 3.3 to **`apps/mobile/_vault/notifications/`**, keeping relative paths, plus a `README.md` listing each file, its original path, and a SHA-256 checksum.
3. Keep the vault **outside `src/`**, excluded from `tsconfig.json` (`exclude`), ESLint and Prettier, so nothing in the rebuild can import, lint or reformat it.
4. Never delete `assets/sounds/notification_sound.wav` or the plugin entry in `app.json`; they stay in place during the whole rebuild (these are native config, not application code).

### 4.2 Invariants (must be identical after the rebuild)
- Channel id `custom_channel`, importance HIGH, vibration `[0,250,250,250]`, sound `notification_sound.wav`.
- Category id `custom_category`, action ids `action_done` and `action_missed`, `opensAppToForeground: false`.
- Notification `data` shape `{ reminderId }` and tap route to the reminder details screen.
- Local schedule ids `dayflow-reminder:<reminderId>:<day>`, weekly trigger, same channel and sound.
- Token flow: permission, `getExpoPushTokenAsync({ projectId })`, upsert into `expo_push_tokens` on conflict `token`.
- The Expo Go Android shim stays; real testing needs a development or preview build on a **physical device**.
- `app.json` notification plugin block, bundle id, package, EAS project id, `google-services.json`.

### 4.3 Baseline test (record before Phase 1, repeat in Phase 9)
Run on one physical Android and one physical iOS device, from a development build:
1. Permission prompt appears once and is granted.
2. A token row appears in `expo_push_tokens` for the signed-in user.
3. A reminder scheduled 2 minutes ahead fires **with the custom sound**, with the app in foreground, background and closed.
4. **Done** and **Missed** buttons change the reminder status without opening the app.
5. Tapping the notification opens that reminder's details.
6. A test push sent through `useTestNotification` arrives with sound.
7. Editing a reminder's time or days reschedules it, and the old schedule no longer fires.
Save the results as the reference for Phase 9.

### 4.4 Restore procedure (Phase 9) and the one planned edit
- Copy the vault back to `src/notifications/` and the two services to the new services folder, keeping the aliases `@notifications`, `@services`, `@types`.
- **Single planned edit:** replace the Redux dispatch in `applyReminderStatusFromNotification` with a call to the new reminders service (`updateReminderStatus`). No other behaviour changes. The edit is reviewed as a diff against the vault copy.
- Re-add the handler and channel creation from `_layout.tsx` into the new root layout, unchanged.
- Run the 4.3 test and compare with the Phase 0 results.

---

## 5. Decisions (resolved: Supabase only, nothing complex)

Direction from the owner: **no backend server; use Supabase only; park anything that needs our own backend.** Remaining choices take the simplest option, and any can be reversed later.

| ID | Decision | Outcome |
|----|----------|---------|
| **D1** | Activity push between client and owner | **ON HOLD.** It needs a server (or a database change). Activities still appear for the other side in the app through Supabase, and the inbox keeps working. Revisit after the app is built |
| **D2** | Web-created reminders while the app is closed | Resync when the app opens or returns to the foreground. **Background resync is on hold**; known limit documented in 9.1 |
| **D3** | One app for both roles | **One app**, role chosen at sign-in, as on the web |
| **D4** | Replace Redux, saga, persist and axios | **Yes**, React Query plus services and hooks, except the notification vault |
| **D5** | Styling | **Keep NativeWind**, colours from `shared/brand/theme.ts` |
| **D6** | Google sign-in | **Later** (end of Phase 2 if time allows). Email and password first, so no OAuth setup blocks the build |
| **D7** | Migrations 038 and 039 | **Not blocking.** Notes screens accept a missing category, so they work whether or not 039 is applied. Owner applies 038 only after the new web build is deployed |
| **D8** | AI Assist tab | **Parked** (hidden, code stays in git) |
| **D9** | Legacy Vercel backend | **Not used.** Remove `axios` and `BASE_URL` after the rebuild |

---

### Changes made while building

- Today has no reminders section and no large clock, at the owner's request. Reminders open from More.
- Drag to reorder became a reorder mode with up and down buttons, which works with screen readers and needs no extra native dependency.
- Date and time fields open in place instead of native pickers, so they work inside sheets without stacking modals or a new native module.
- No persisted query cache or offline banner yet. The permission primer was left out so the preserved permission flow stays as it was.
- Reminders keep the mobile `Reminder` shape throughout, as the preserved scheduler expects it.

---

## 6. Target architecture

```
apps/mobile/
  app/                         expo-router routes only (thin files that render screens)
    (auth)/                    sign-in, sign-up, forgot, reset, role, not-a-client
    (owner)/(tabs)/            today, calendar, projects, clients, more
    (owner)/...                detail stacks (project, note, client, reminders, ...)
    (client)/(tabs)/           home, projects, alerts, more
    (client)/...               project detail, ...
  src/
    features/
      owner/<feature>/{components,hooks,screens,constants,types,utils}
      client/<feature>/...
      shared/<feature>/...     activities, settings, account, notifications inbox
    services/                  db.ts + one <domain>Service.ts each (Supabase only here)
    ui/                        design-system components (Phase 1)
    theme/                     tokens from shared/brand/theme.ts, fonts
    lib/                       supabase client, query client, date and time helpers
    notifications/             EMPTY until Phase 9 (restored from the vault)
  _vault/notifications/        frozen copy (section 4)
  docs/                        this plan, mobile TASKS and MEMORY
```

- **Data flow:** screen -> hook (React Query) -> service -> Supabase. Screens hold no query logic.
- **Server state:** React Query with a persisted cache for fast cold starts, optimistic updates for toggles, reorders and status changes, and rollback on error.
- **Port for reminders:** `features/owner/reminders/notificationPort.ts` exports `syncReminderSchedule(reminders)`. It is a **no-op** until Phase 9, then calls the restored scheduler. Reminder screens never import notification code directly, so the vault attaches at exactly one seam.
- **Times** stay as display text such as `"10:00 AM"` in the database; convert at the service boundary (the current `reminderMapper.ts` is the reference).
- **Roles:** after sign-in, route groups `(owner)` and `(client)` guard access. Client access uses only `link_client_portal_user()`, `fetch_client_portal_projects()` and the RLS-scoped activity tables.

---

## 7. Mobile UX principles (applied to every screen)

1. **Bottom tab bar, 5 items max**, thumb reachable. Secondary destinations live under "More". No hamburger drawer.
2. **One primary action per screen**, as a floating action button or a sticky bottom bar, never a top-right button.
3. **Forms in bottom sheets or full-screen modals**, never cramped inline. Keyboard-aware, with the primary button above the keyboard, correct keyboard types and `returnKeyType`. Dirty forms ask before discarding.
4. **Swipe actions on rows** (edit, delete) and long-press to reorder with a visible drag handle. No kebab menus on rows.
5. **Pull to refresh** on every list; **skeletons** shaped like the real screen (a Reanimated shimmer, since phantom-ui is web-only); empty states with a single clear next action; error states with Retry.
6. **Deletes**: confirmation sheet naming what goes with it (as the web rule), then a toast. Haptics on success, warning and destructive actions.
7. **Dates and times** use native pickers; the calendar is a month strip plus a day agenda with a timeline, not a desktop grid.
8. **Touch targets 44pt or more**, safe-area aware, works on 320pt-wide phones, supports Dynamic Type and screen readers (labels, roles, focus order).
9. **Light and dark follow the device**, tokens only. Reduced-motion respected. Motion limited to entrances and transitions that explain state.
10. **Charts are glanceable**: large numbers, simple bars and rings, tap for detail; no dense desktop charts.
11. **Offline aware**: cached data shows instantly with a subtle offline banner; writes fail with a clear retry rather than silently.
12. **Notifications are first-class**: a bell with an unread badge, an inbox, deep links from every push to the right screen.

---

## 8. Screens and navigation

### 8.1 Auth and onboarding (stack)
| Screen | Mobile design notes |
|--------|---------------------|
| Welcome / role | Choose **Workspace** or **Client**; 3D art; demo account button under the Workspace path |
| Sign in | Email and password, Google, "Continue with demo account", forgot link; inline validation |
| Sign up | Name, email, password with a strength hint; confirmation message |
| Forgot / reset password | Email step, then deep link `dayflow://` to set a new password |
| Not a client | Shown when `link_client_portal_user()` finds no match; explains and offers sign out |
| Permission primer | Friendly pre-prompt before the system notification prompt (Phase 9) |

### 8.2 Owner app (5 tabs plus stacks)
**Tabs:** Today, Calendar, Projects, Clients, More. A bell with an unread badge sits in the Today header.

| Web page | Mobile screen(s) | Mobile adaptation |
|----------|------------------|-------------------|
| Dashboard | **Today** | Greeting, date range chips, horizontal stat cards (Pending, Overdue, Total Projects, Completed), "Today's reminders" and "Due today" lists, todo list with swipe and reorder, time tracker as a compact card (stays accurate after the app is backgrounded because it counts from stored timestamps), completion chart as a simple bar or area card, weekly insights as a swipeable card |
| Tasks Calendar | **Calendar** | Month strip, day agenda and a timeline; swipe between days, "Today" button, FAB to add, tap an hour to add at that time; task details in a bottom sheet |
| Task create or edit | Sheet | Title, description, priority segmented control, native date and time pickers, status chips |
| Projects Management | **Projects** | Search, Active or Inactive and Personal or Client filter chips, cards with colour dot, swipe to edit or delete, reorder mode, FAB |
| Project detail | Stack screen | Header with colour chip, segmented tabs: Overview, Notes, Links, Activities; activate or deactivate and delete in a header menu |
| Notes list | Tab inside project | Search and category chips, swipe actions, reorder |
| Note editor | Full-screen | Large title, category chip, plain-text body (notes are plain text shared with the web), per-note links sheet, duplicate and delete in a menu, autosave indicator and unsaved guard |
| Reference links | Section or sheet | Tap to open the browser, add and edit in a sheet |
| Clients Management | **Clients** | Search, Active filter, portal-access chip, call and email quick actions, swipe actions, FAB |
| Client detail | Stack screen | Segmented tabs: Overview, Projects, Activities, Conversation; "New project" prefilled with this client |
| Client activities | Tab inside client and project | Tasks, Meetings and Calls tabs with Open and Closed sections, FAB per type, status change by swipe |
| Conversation | Tab | Chat bubbles, composer above the keyboard, optimistic send |
| Daily Reminders | **Reminders** (from Today and More) | Weekday chips and a today view first, then "All reminders"; time picker and day toggles in a sheet; disable until a date; status Done, Upcoming, Paused, Missed |
| Reminder history | Screen | Past occurrences grouped by day, tap for details (carried over from the current app) |
| Notifications | **Inbox** (More, and the bell) | Segmented Reminders and Tasks and Activities, swipe to mark read, "Mark all read", deep link into the item |
| Analytics | **Analytics** (More) | Stat tiles, task status ring, notes per project bars |
| Account | **Profile** (More) | Identity header, member since, activity stats, quick links |
| Settings | **Settings** (More) | Profile (name, avatar), theme (System, Light, Dark), change email with confirmation, password set or reset, **notification preferences** that actually control the push and reminder behaviour, sign out, help and support |

### 8.3 Client app (4 tabs)
**Tabs:** Home, Projects, Alerts, More.

| Web page | Mobile screen(s) | Notes |
|----------|------------------|-------|
| Client Dashboard | **Home** | Stat tiles (Active projects, Tasks completed, Meetings completed, Calls attended), recent activity |
| Projects | **Projects** | Only shared projects (`fetch_client_portal_projects()`), search |
| Project detail | Stack screen | Info, Activities tabs; FAB **Raise** with a choice of task, meeting or call (saved with `raised_by = 'client'`); clients edit only their own items |
| Notifications | **Alerts** | Inbox as above |
| Analytics | More | Activities by status and type, per project |
| Account and Settings | More | Same shared screens as the owner |

---

## 9. Notification system specification

### 9.1 Reminders (every reminder notifies)
- **Mechanism:** the preserved local scheduler (weekly local notifications). Works with the app closed and with no network.
- **Resync triggers:** app launch, app foreground, sign-in, any reminder create, edit, delete or status change, and midnight rollover. Sign-out cancels all `dayflow-reminder:*` schedules.
- **Behaviour:** same channel, sound, Done and Missed buttons and tap target as today. Done and Missed also write the result (reminder status and, where the app already does, the occurrence).
- **Known limits to verify in Phase 9 (not changed beforehand):**
  - iOS keeps only the soonest **64** pending local notifications. The scheduler creates up to 7 per reminder, so about 10 daily reminders reach the cap. Verify, then fix through a documented, tested change (for example one daily trigger for reminders that run every day).
  - "Disable until a date" must resume on its date. Resync handles it only if the app or background task runs.
  - A reminder created on the web needs the phone to open once to schedule it. Background resync is on hold (D2).

### 9.2 Activities between workspace and client (push is ON HOLD)

**What works now, with Supabase only:** a client raises a task, meeting or call from the client app; it is saved with `raised_by = 'client'` and shows up for the owner on the project's Activities tab and on the web. The owner's activities on a client project show for the client the same way. Both sides see the latest data on open, on pull to refresh, and when the app returns to the foreground.

**On hold (needs our own backend):** a push notification to the *other* person when an activity is raised or changed.

**Why it is on hold (checked in the migrations):** a user can read and write only their own `expo_push_tokens` and `notifications` rows, and `notifications.notification_type` allows only `reminder` and `task`. So one person's phone cannot look up the other's push token or create a notification for them, and the push itself must be sent by something that holds both. That something is a server, which is out of scope for now.

**When it is picked up later**, the intended design is already recorded: events (client raises, owner raises, status changes), recipients (`projects.user_id` for the owner, `clients.auth_user_id` for the client), payload `{ type: 'activity', kind, activityId, projectId }`, a separate Android channel `activity_channel` (the preserved `custom_channel` is never touched), and a Supabase Edge Function with a database webhook as the likely mechanism. None of this is built or required for the app to be complete.

### 9.3 Notifications inbox and preferences
- Inbox reads the existing `notifications` rows (types today: reminder, task).
- Settings gets real switches for: reminder alerts, activity alerts, sound, and quiet hours. These are stored on the device and respected by the scheduler and handlers. (The web only has dummy browser preferences, so this is mobile-specific.)

---

## 10. Phases

Each phase ends in a working, testable build and a commit on `mobile-rebuild`. Do not start a phase until the previous exit criteria pass.

### Phase 0: Preserve and baseline
- Direction is set (section 5). Nothing to approve before starting.
- Tag and branch, build the vault with checksums (section 4.1), exclude it from build tooling.
- Run and record the baseline notification test on real devices (section 4.3).
- Back up `.env.local`, `google-services.json`, and the EAS credentials note.
- **Exit:** vault verified by checksum, baseline results saved, branch created.

### Phase 1: Foundation and design system
- Remove Redux, saga, persist and axios usage (outside the vault); keep React Query.
- Folder structure (section 6), strict TypeScript, ESLint, aliases (keep `@notifications`, `@services`, `@types`).
- `services/db.ts` with all 16 tables from the web (columns as listed in the handoff) and the `supabase` client.
- Theme from `shared/brand/theme.ts` into Tailwind config and a theme provider (light, dark, system); fonts Ovo, Young Serif, Merriweather; brand manifest copy.
- UI kit: Button, IconButton, Input, Select, Date and Time pickers, SegmentedTabs, Chip, Card, ListRow with swipe actions, Sheet, ConfirmSheet, Toast, Skeleton, EmptyState, ErrorState, StatTile, StatusPill, Avatar, FAB, Screen and Header, FormField with validation, Badge.
- 3D art converted from the web assets for auth and empty states.
- **Exit:** a storybook-style demo screen renders every component in light and dark, on a 320pt device, with no hard-coded colours.

### Phase 2: Shell, navigation and auth
- Route groups, tab bars, guards, session handling (AsyncStorage session, auto refresh, local-scope sign out).
- Screens in section 8.1, including Google sign-in (D6, adds the `dayflow` scheme), demo account, password reset by deep link, role selection and `link_client_portal_user()` with the not-a-client screen.
- **Exit:** sign in, sign out, session restore, owner and client routing, forgot and reset all work on a device; unauthenticated users cannot reach protected routes.

### Phase 3: Today, todos, time tracker, tasks calendar
- Tasks service and hooks; Today screen; todos with reorder; time tracker; calendar month strip, day agenda and timeline; task sheet (create, edit, delete, status, priority, date and time); overdue and "missed" display.
- **Exit:** all task and todo flows work with real data; matches web numbers for the same account.

### Phase 4: Reminders (screens, with the notification port as a no-op)
- Reminders service (reuse the proven mapper logic), list, today view, create and edit sheet, disable until, history, reminder details.
- `syncReminderSchedule` port created and called after every change, but empty.
- **Exit:** reminders CRUD and history work; the port is invoked at every trigger point (verified by logs).

### Phase 5: Projects, notes, reference links
- Projects list and sheet, project detail with tabs, notes list, note editor (autosave and guards), reference links for projects and notes, reorder, activate or deactivate, delete with cascade explanation. Confirm D7 first.
- **Exit:** full parity with the web projects and notes, including a note with no category.

### Phase 6: Clients, activities, conversation (owner side)
- Clients list and sheet, client detail with tabs, "New project" prefilled, shared **activities module** (tasks, meetings, calls with Open and Closed) built so the client app reuses it with `forClientPortal` and `raised_by` switches, conversation chat.
- **Exit:** owner can manage clients and raise and update activities; data visible on the web.

### Phase 7: Client portal
- Client home, projects, project detail with the Raise flow, client rules enforced (edit only own items), not-a-client path.
- **Exit:** verified with a real client login (the owner provides one); a client sees only shared projects; raised items appear on the web with `raised_by = client`.

### Phase 8: Analytics, notifications inbox, account, settings
- Owner and client analytics, inbox screens with mark read and deep links, Account and Settings (profile, theme, email change, password, notification preferences UI, sign out, help and support).
- **Exit:** every web route has a mobile screen (section 11 checklist is fully ticked).

### Phase 9: Restore the preserved notification system
- Follow section 4.4: restore the vault, make the single planned edit, re-add the handler and channel in the root layout, connect the port to `scheduleLocalReminderNotifications`, add resync triggers, add the permission primer and register the token after sign-in.
- Check the limits in 9.1 (64 pending cap, disable until) and record findings.
- **Exit:** the Phase 0 baseline test passes identically; every reminder fires with sound in foreground, background and closed states; sign-out clears schedules; nothing in the vault diff except the single planned edit.

### Phase 10: Activity visibility (push on hold)
- Verify both directions with two real accounts: a client raises a task, meeting and call and the owner sees each (app and web); the owner raises or updates one on a client project and the client sees it; pull to refresh and foreground refresh both update.
- Unread indicators in the app for new counterparty activity (a badge on the project and a dot on the Activities tab) based on data already in Supabase and a device-local "last seen" time. No push, no server.
- **Not built:** push between client and owner (section 9.2), until the owner decides to add a backend.
- **Exit:** activities flow both ways in the app with correct `raised_by` rules; nothing here adds a server or a database change.

### Phase 11: Hardening
- Performance (list virtualization, image sizes, startup time), offline behaviour, error and empty states audit, accessibility audit (screen reader, Dynamic Type, contrast), 320pt to tablet layouts, light and dark on every screen, crash and error reporting, security review of the service layer and storage.
- **Exit:** QA matrix (section 12) passes; no blocking issues.

### Phase 12: Release
- EAS preview then production builds, internal testing tracks (TestFlight and Play), demo account for store review, store listing, privacy details (notifications, account), versioning, rollback plan.
- **Exit:** build approved for submission.

---

## 11. Parity checklist (every web route has a mobile home)

Owner: sign in, sign up, forgot, reset, demo; Dashboard; Tasks Calendar; Projects list; Project detail; Note editor; Clients list; Client detail; Daily Reminders; Notifications; Analytics; Account; Settings.
Client: client sign in and sign up, not-a-client; Dashboard; Projects; Project detail with Raise; Notifications; Analytics; Account; Settings.
Plus mobile-only: reminder history, permission primer, notification preferences.

---

## 12. Testing and QA

- **Devices:** one small Android (320pt-wide class), one large Android, one small iPhone, one large iPhone. **Notification tests need physical devices**; Expo Go on Android cannot test them.
- **Per screen:** loading, empty, error, offline, light, dark, large text, screen reader, keyboard open, interrupted network.
- **Data:** compare counts and values with the web for the same account (the shared demo account for owner; a real client login for the portal).
- **Notifications:** the 4.3 baseline plus: reminder at midnight rollover, timezone change, device reboot, app killed, battery saver, permission denied then enabled, two-device activity test in both directions.
- **Automated:** unit tests for mappers (reminders, times), the scheduler input shape and the reminder resync logic; service tests against mocked Supabase; a smoke test that every route renders.

---

## 13. Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| Rebuild breaks push or sound | Vault with checksums, baseline test, single planned edit, channel and plugin config never touched |
| Android channel changes are permanent | Never rename or reconfigure `custom_channel`; new alerts use a new channel |
| iOS 64 local notification cap | Verify in Phase 9, then a tested, documented scheduler change |
| Web-created reminders do not fire until the phone opens | Documented limit; background resync and server push on hold (D2) |
| Cross-user push impossible without a server | On hold (D1); in-app visibility only, documented |
| Client login not available for testing | Owner provides one before Phase 7 |
| Scope creep from "mobile best practice" | Features stay web-parity; UX differences are interaction patterns, not new functions |
| Old backend dependency | Not used by the rebuild (D9); remove `axios` at the end |
| New native dependencies need a fresh dev build | Do dependency additions in Phase 1, build once, then avoid native changes |

---

## 14. Definition of done

1. Every screen in sections 8 and 11 exists, works with real data, and passes the section 7 principles in light and dark on small and large phones.
2. The database is unchanged and no backend server exists or is called.
3. The notification vault diff against the baseline contains only the single planned edit, and the baseline test passes identically.
4. Every reminder fires with the custom sound; activities raised by either side are visible to the other in the app. Cross-user activity push is explicitly on hold and listed as such.
5. `docs/` for mobile (this plan, TASKS, MEMORY) is current, and `apps/mobile/CLAUDE.md` points to it.

---

## Appendix A: Dependencies to add (confirm in a Phase 1 spike; versions chosen then)

Bottom sheets and gestures (`@gorhom/bottom-sheet`, already have gesture-handler and Reanimated); drag to reorder (`react-native-draggable-flatlist`); date and time pickers (`@react-native-community/datetimepicker`); charts (`react-native-gifted-charts` or hand-built with the installed `react-native-svg`); fonts (`@expo-google-fonts/ovo`, `young-serif`, `merriweather`); OAuth (`expo-auth-session`, `expo-web-browser`); secure storage (`expo-secure-store`) if sessions move off AsyncStorage; `expo-image`; `date-fns`.
Remove after the rebuild (outside the vault): `@reduxjs/toolkit`, `react-redux`, `redux-persist`, `redux-saga`, `axios`, drawer navigation.

## Appendix B: Environment

`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (existing, in `.env.local`). `EXPO_PUBLIC_BASE_URL` is retired once D9 is confirmed. No server secrets are involved; the app uses only the public Supabase URL and publishable key.

## Appendix C: Working agreement

One phase at a time, owner review at each exit, commits on `mobile-rebuild`, merge to `main` only after Phase 11. Update `apps/mobile/docs/TASKS.md` as work lands.
