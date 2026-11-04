# Notification vault

Frozen copy of the working notification setup, taken at git tag `mobile-notifications-baseline`. Not compiled, linted or imported. Restored in Phase 9 of `apps/mobile/docs/MOBILE_REBUILD_PLAN.md` (section 4.4).

Paths inside this folder match their original paths under `apps/mobile/`. `CHECKSUMS` holds SHA-256 hashes; check with `shasum -a 256 -c CHECKSUMS` from this folder.

`assets/sounds/notification_sound.wav` and the `expo-notifications` plugin in `app.json` stay in place during the rebuild.

Never change: channel `custom_channel`, sound `notification_sound.wav`, category `custom_category`, actions `action_done` and `action_missed`, schedule ids `dayflow-reminder:<id>:<day>`, data shape `{ reminderId }`.

The baseline device test can always be run by building the tag.
