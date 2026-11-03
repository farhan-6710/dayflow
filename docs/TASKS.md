# Tasks — DayFlow Web Rebuild

Status: `[x]` done · `[ ]` to do · `[~]` blocked or needs a decision. Work top to bottom; verify each feature before the next.

## Phase 0: Prep

- [x] Old web app removed (commit `0e42896`); `.env` kept; DB untouched
- [x] Route/feature spec: [WEB_REBUILD_SPEC.md](./WEB_REBUILD_SPEC.md)
- [x] Env, links, DB contract: [WEB_ENV_AND_LINKS.md](./WEB_ENV_AND_LINKS.md)
- [x] Docs rewritten (awaiting review)

## Phase 1: Foundation

- [x] Scaffold Vite + React 19 + TypeScript in `apps/web` (keep `.env`)
- [x] Install dependencies listed in [ARCHITECTURE.md](./ARCHITECTURE.md)
- [x] Tailwind 4 + `shadcn init` (alias `@/`, components in `shared/ui`)
- [x] Apply [theme.css](./theme.css) to `src/index.css`; add Ovo + Merriweather fonts
- [x] `@dayflow/brand` alias to `shared/brand`; SEO title and description from manifest
- [x] `services/supabaseClient.ts` and `services/db.ts` (columns from old `db.ts` in git)
- [x] Restore logos, favicons, 3D assets into `public/`
- [x] ESLint, strict tsconfig, `bun run build` passing

## Phase 2: App shell

- [x] Generate icon and illustration sheets, slice into `public/images/dayflow/{icons,illustrations}` (see [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md))
- [x] `AuthProvider`, `ThemeProvider`, Toaster, tooltip provider
- [x] Router, `lazyRoutePage`, route constants, legacy redirects, `RouteErrorPage`
- [x] Guards: `PublicRoute`, `ProtectedRoute`, `ClientPublicRoute`, `ClientProtectedRoute`
- [x] `AppShellLayout`: header, collapsible sidebar, mobile nav sheet, main outlet, page transition
- [x] `AppLayout` (8 nav items) and `ClientAppLayout` (5 nav items) configs
- [x] Shared pieces: `PageHeader`, `EmptyState`, `ErrorBanner`, skeletons, `StatCard`, `DirectoryTable`, `ConfirmationModal`, `showToast`, unsaved-changes guard

## Phase 3: Auth

- [x] Workspace: login, sign up, forgot and reset password, demo login
- [x] Google OAuth: popup callback and `/auth/oauth-callback` page
- [x] Client portal: auth page, `/not-a-client`, link via `link_client_portal_user()`
- [x] Settings (profile, email, password, theme), needed early for the user menu

## Phase 4: Workspace features

Each item: service → hook → page → states → verify.

- [ ] Projects and notes: list, detail, reference links, note editor with categories
- [ ] Clients: list, detail, create/edit/delete, chat
- [ ] Client activities (tasks, meetings, calls): shared block, both portals
- [ ] Tasks Calendar: month view, day panel, task CRUD, reorder, status legend
- [ ] Daily Reminders: weekly table, CRUD, disable-until
- [ ] Notifications: inbox (reminders, tasks), mark read, header bell badge
- [ ] Dashboard: date filters, stat cards, completion chart, todo list, time tracker, insight cards
- [ ] Analytics: stat cards, status pie, notes-per-project bar

## Phase 5: Client portal

- [ ] Dashboard (stat cards, activities)
- [ ] Projects list and project detail with raise-activity flow
- [ ] Notifications (real inbox, replacing the empty placeholder)
- [ ] Analytics (client-specific, not the owner page)
- [ ] Settings

## Phase 6: Polish and release

- [ ] Responsive pass: phone, tablet, desktop, both portals
- [ ] Dark mode pass on every screen
- [ ] Accessibility pass: focus, labels, keyboard drag and drop, contrast
- [ ] Loading, empty and error states audited on every page
- [ ] Parity check against the spec, page by page
- [ ] Production build; deploy to Hostinger; confirm Supabase redirect URLs

## Phase 7: Mobile rebuild

- [ ] Plan mobile scope from the web spec; reuse [theme.css](./theme.css) tokens
- [ ] Rebuild `apps/mobile` screens with feature parity
- [ ] iOS release

## Needs a decision (all conflict with "never change the database")

- [~] Server-side notifications (cron / Edge Function) instead of the browser timer
- [~] Task notifications (type exists, nothing creates them)
- [~] Transactional email and per-user preferences
- [~] Client-side chat in the portal (may need new RLS)
- [~] Mobile push events

## Later

- [ ] Desktop app (Tauri) on the new web build
- [ ] Release automation
