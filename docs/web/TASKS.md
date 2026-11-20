# Tasks — DayFlow (web)

`[x]` done · `[ ]` to do. Product: [PRD](../PRD.md) · Structure: [ARCHITECTURE](./ARCHITECTURE.md).

## Done

- [x] Web rebuild: Vite + React 19 + TypeScript, theme, shell, both portals
- [x] Auth: email/password, Google OAuth, demo login dialog, client portal link
- [x] Workspace: dashboard, tasks calendar, projects + notes, clients + chat, activities, reminders grid, notifications, analytics, settings
- [x] Client portal: dashboard, projects, activities, notifications, analytics, settings
- [x] Public website (`/`, features, how it works, about, contact) with Embla carousels and a faux-UI illustration pass on the home page
- [x] Flowy assistant: Gemini Edge Function, streaming replies, in-browser tools, chat kept in `sessionStorage`
- [x] `user_settings` (page transitions, notification toggles)
- [x] Theme-switch reveal animation, route transitions, sidebar motion
- [x] Project colours resolved from stored `color_hex` (`resolveProjectColor`)
- [x] Desktop (Tauri): builds, branded icons, `dayflow://` deep link, releases on GitHub (now `0.1.17`)
- [x] Responsive, dark mode, a11y, loading / empty / error states
- [x] Install / uninstall docs in [README](../../README.md)
- [x] Sharing and SEO: title, description, canonical, Open Graph / Twitter tags and JSON-LD in static `index.html`, 1200×630 share card, light/dark PNG favicons, apple-touch icon, `robots.txt`, `sitemap.xml`
- [x] Brand manifest moved to the repo root, imported by relative path; `bun run build`, `lint` and `tsc -b` pass

## Needs the owner

- [ ] After deploy, paste the site URL into WhatsApp and opengraph.xyz to confirm the share card, title and description show (WhatsApp caches; a changed image may need a new filename)
- [ ] If a custom domain is used, update `siteUrl` in `brandManifest.json`, `public/robots.txt`, `public/sitemap.xml` and the card's domain strip (`scripts/share-card/card.html`), then `bun run share-card`

- [ ] Confirm Supabase redirect URLs for `https://dayflow-web-version.vercel.app`
- [ ] Verify client portal with a real client login
- [ ] Install a release build and test Google sign-in (`dayflow://` only works on the installed app)
- [ ] Review public website copy and layout
- [ ] Decide on the backend / database items below; they conflict with "apps never change the DB" unless the owner asks:
  - Server-side reminder and notification jobs (today: browser timer while a tab is open)
  - Creating task notifications (type exists; nothing writes them)
  - Transactional product email and richer notification preferences
  - Client-side chat in the portal (may need RLS changes)
  - Mobile push events

## Later

- [ ] Desktop notifications (`tauri-plugin-notification`); on Windows/Linux also `tauri-plugin-single-instance` for the sign-in link
- [ ] Release automation (tag to GitHub Release with `.dmg` / `.exe`)
- [ ] Read `productName` and window title in `src-tauri/tauri.conf.json` from `brandManifest.json` (a build step; they are hard-coded `DayFlow` today)
- [ ] Move the long marketing copy in `features/site/constants/` (`homeContent`, `featuresContent`, `faqContent`) into the manifest or keep it as page copy by decision; only name, tagline and descriptions come from the manifest today
- [ ] `promotionBanners` in `brandManifest.json` is read by no code and its paths (`/brand-promotion-banner-*.png`) do not exist in `public/`; the only banner is `apps/web/design/brand/brand-promotion-banner-img-dark.png`. Wire it up or remove the key
- [ ] `shared/brand/theme.ts` is generated but nothing imports it; stop generating it or use it
- [ ] Automated tests (none today)
- [ ] Real testimonials / founder photo on the site only if the owner wants them (needs consent)

## Mobile

Tracked in [mobile TASKS](../mobile/TASKS.md).
