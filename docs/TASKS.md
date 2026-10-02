# Tasks — DayFlow

Implementation roadmap. Update status as work lands.

| Status | Meaning |
|--------|---------|
| Done | Shipped |
| Next | Near-term priority |
| Later | Backlog |

## Done

- [x] Dual portals (workspace + client) on shared Supabase + RLS
- [x] Workspace: tasks/calendar, projects, clients, notes, reminders, notifications, analytics
- [x] Client activities (tasks / meetings / calls) with `raised_by`
- [x] Notes: category + search; note reference links
- [x] Projects: `is_active` (active/inactive) instead of archive
- [x] Client detail actions: new project (prefilled), delete, see projects; activities list stays fresh after create
- [x] Desktop (Tauri) macOS/Windows; Google OAuth deep link
- [x] Mobile (Expo): reminders + Expo push; Android preview
- [x] Brand manifest as copy source of truth; docs + docs banner description aligned

## Next

- [ ] iOS mobile release
- [ ] Keep auth promo banners (`brand-promotion-banner-light/dark.png`) in sync with manifest copy
- [ ] PHP on Hostinger for transactional email + cron (planned)

## Later

- [ ] Broader mobile feature parity beyond reminders
- [ ] Store distribution (Play Store / App Store) when ready
- [ ] Hardening: unsigned desktop install UX, release automation
