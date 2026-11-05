# Tasks — DayFlow Mobile (Flutter)

`[x]` done · `[ ]` to do · `[~]` on hold. The build phases will come from the owner's plan.

## Done

- [x] Expo app removed. Only `images/` and `docs/` remain
- [x] Docs rewritten for Flutter

## Before development

- [ ] Install Flutter, then confirm with `flutter doctor` (not on this Mac yet; needs Xcode and Android Studio)
- [ ] Free up disk space (the Mac was full on 2026-11-05)
- [ ] Owner's build plan
- [ ] Decide the decisions in [MEMORY.md](./MEMORY.md)

## First steps once the plan arrives

- [ ] Create the Flutter project in `apps/mobile`, keeping `images/` and `docs/`
- [ ] Add `apps/mobile/CLAUDE.md` so this folder loads its docs again, and update the table in the root `CLAUDE.md`
- [ ] Generate Dart theme and brand values from `shared/brand/`, then remove `theme.ts`
- [ ] Add illustrations from `apps/web/public/images/dayflow/illustrations/` and the fonts

## On hold (needs a server or a database change)

- [~] Push between client and owner when an activity is raised or changed
- [~] Updating a phone's reminders while the app is closed
