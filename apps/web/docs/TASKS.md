# Tasks — DayFlow Web

`[x]` done · `[ ]` to do · `[~]` needs a product / backend decision.

Product: [PRD](../../../docs/PRD.md) · Structure: [ARCHITECTURE](./ARCHITECTURE.md).

## Done

- [x] Web rebuild: Vite + React 19 + TypeScript, theme, shell, both portals
- [x] Auth: email/password, Google OAuth, demo login, client portal link
- [x] Workspace: dashboard, tasks calendar, projects + notes, clients + chat, activities, reminders, notifications, analytics, settings
- [x] Client portal: dashboard, projects, activities, notifications, analytics, settings
- [x] Public website (`/`, features, how it works, about, contact)
- [x] Tempo assistant (Gemini Edge Function + in-browser tools)
- [x] `user_settings` (page transitions and related toggles)
- [x] Desktop (Tauri): builds, branded icons, `dayflow://` deep link, releases pipeline artifacts
- [x] Responsive, dark mode, a11y, loading / empty / error states
- [x] Install / uninstall docs in [README](../../../README.md)

## Owner checks

- [ ] Confirm Supabase redirect URLs for `https://dayflow-web-version.vercel.app`
- [ ] Verify client portal with a real client login
- [ ] Install a release build and test Google sign-in (`dayflow://` only works on the installed app)
- [ ] Review public website copy and layout

## Later

- [ ] Desktop notifications (`tauri-plugin-notification`); on Windows/Linux also `tauri-plugin-single-instance` for the sign-in link
- [ ] Release automation (tag → GitHub Release with `.dmg` / `.exe`)
- [ ] Real testimonials / founder photo on the site only if the owner wants them (needs consent)

## Needs a decision

These need a backend or database change and conflict with “apps never change the DB” unless the owner asks:

- [~] Server-side reminder / notification jobs (today: browser timer while a tab is open)
- [~] Creating task notifications (type exists; nothing writes them)
- [~] Transactional product email and richer notification preferences
- [~] Client-side chat in the portal (may need RLS changes)
- [~] Mobile push events

## Mobile

Tracked in [apps/mobile/docs/TASKS.md](../../mobile/docs/TASKS.md).
