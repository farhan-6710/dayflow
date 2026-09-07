![Dayflow Banner](../apps/web/public/brand-promotion-banner-img-dark.png)

# DayFlow — Workspace, Client Portal & Mobile App

DayFlow is a workspace for personal day-to-day use and freelancers. Manage tasks, projects, clients, and reminders; give clients a portal to view shared work and raise activities.

**Platforms:** Web · Desktop (macOS & Windows) · Mobile (Android available; iOS about to release)

---

## Try DayFlow (web)

### 1. Open the live app

**[https://bisque-gull-237581.hostingersite.com](https://bisque-gull-237581.hostingersite.com)**

### 2. Sign in to the workspace

Go to **[Workspace login](https://bisque-gull-237581.hostingersite.com/workspace/auth)** (owner portal; `/admin-portal` redirects here).

Use the **demo account** shown on the login screen, or create your own account.

You’ll land on the workspace dashboard — tasks, projects, clients, reminders, notifications, and analytics.

The same credentials work on the desktop apps (macOS & Windows) and the Android app. They all talk to one Supabase project.

### 3. Client portal (optional)

Clients sign in at **[Client portal login](https://bisque-gull-237581.hostingersite.com/client-portal/auth)** with an email linked to a client record in the same workspace.

---

## Install DayFlow (desktop)

Desktop apps are available for **macOS** and **Windows**. Download the latest build for your OS from [GitHub Releases](https://github.com/farhan-6710/dayflow/releases).

### macOS

1. Download the `.dmg`
2. Open it and drag **DayFlow** into **Applications**

**First launch:** macOS may block unsigned apps with a “damaged” warning. Fix it once:

**Option A — Terminal:**

```bash
xattr -cr /Applications/DayFlow.app
```

**Option B — Right-click:** Applications → right-click **DayFlow** → **Open** → **Open**

Then open DayFlow and sign in with the demo account (or your own), same as on the web.

### Windows

1. Download the Windows installer (`.exe` / `.msi`) from the same releases page
2. Run the installer and follow the prompts
3. Open **DayFlow** from the Start menu and sign in with the demo account (or your own)

**First launch:** Windows may show **“Windows protected your PC”** (SmartScreen). Click **More info** → **Run anyway**, then continue.

**Google sign-in on desktop:** opens your system browser, then returns to the app via a deep link (`dayflow://`).

---

## Install DayFlow (mobile)

Only the **Android** preview is available right now. The **iOS** app is about to release.

Preview builds use Expo internal distribution (not the App Store / Play Store yet).


| Platform    | Status                                                                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Android** | [Install preview APK](https://expo.dev/accounts/farhan_6710/projects/personal-assistant-app/builds/d5d3cb5c-e0c1-4840-8c19-8f742cca572d) |
| **iOS**     | About to release                                                                                                                         |


Open the Android link **on an Android phone**, tap **Install**, and allow installs from Expo if prompted. Sign in with the same demo account (or your own) as on web and desktop.

---

## One backend: shared Supabase

Web, desktop, and mobile are three clients of **one** Supabase project. There is no per-platform database and no sync layer — Postgres is the source of truth, Auth issues the session, and Row Level Security decides what each user can see.

```text
                    ┌─────────────────────────────────────────┐
  Web               │                                         │
  Desktop           │   Supabase                              │
  (macOS & Windows) │     • Auth  (email / Google)            │
                    │     • Postgres (one schema)             │
  Mobile            │     • RLS policies on every table       │
                    │                                         │
                    └─────────────────────────────────────────┘
```


| Piece               | How it is shared                                                                                                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Project**         | One hosted Supabase URL + anon key. Web reads `VITE_SUPABASE_`*; mobile reads* `EXPO_PUBLIC_SUPABASE_` (EAS env on release builds). Same values, different env prefixes.                                                                    |
| **Auth**            | `supabase.auth.signInWithPassword` (and Google OAuth on web/desktop). A session is `auth.uid()`. Sign in on your phone with the workspace owner account and you are the same user as in the browser.                                        |
| **Schema**          | All SQL lives in `scripts/migrations/` and is applied once to the shared database. Mobile did not get a second schema — it added columns/tables (`reminders.status`, `expo_push_tokens`, `reminder_occurrences`) that web/desktop also use. |
| **Access**          | RLS is the API. Workspace rows are scoped with `user_id = auth.uid()` (or `owner_user_id` for clients). The client portal uses RPCs (`link_client_portal_user`, `fetch_client_portal_projects`) so clients never own `projects` rows.       |
| **Clients in code** | Web/desktop: `apps/web/src/services/`. Mobile: `apps/mobile/src/lib/supabase.ts` + `apps/mobile/src/services/`. Same Postgres tables.                                                                                                       |


**What each surface uses today**

- **Web + desktop (macOS & Windows)** — full product: workspace and client portal
- **Mobile** — owner reminders, local scheduling, and Expo push — same `user_id` as workspace

---

## What it does


| Surface           | Path / app                                       | Who                                                      |
| ----------------- | ------------------------------------------------ | -------------------------------------------------------- |
| **Workspace**     | `/workspace` (web & desktop: macOS, Windows)     | Owner — tasks, projects, clients, reminders, analytics   |
| **Client portal** | `/client-portal` (web & desktop: macOS, Windows) | Client — shared projects, raise tasks / meetings / calls |
| **Mobile**        | Android now; iOS soon                            | Owner — reminders + push, same Supabase user             |


**Highlights:** Supabase Auth · dual-portal RLS · client activities (`raised_by`: workspace client) · in-app notifications · Expo push · optimistic UI · analytics · desktop (macOS & Windows) · Android preview

---

## Tech stack


| Layer                | Stack                                                                             |
| -------------------- | --------------------------------------------------------------------------------- |
| **Web & desktop UI** | React 19 · TypeScript · Vite · Tailwind v4 · shadcn/ui · Framer Motion · Recharts |
| **Desktop shell**    | Tauri 2 — macOS & Windows, wrapping the Vite app                                  |
| **Mobile**           | React Native · Expo (Expo Router) · NativeWind                                    |
| **Backend**          | Supabase (Auth, Postgres, RLS) — shared by every client                           |
| **Tooling**          | Bun (web) · EAS Build (mobile)                                                    |
| **Planned**          | PHP (Hostinger) — transactional emails and cron jobs                              |


---

## Codebase overview

```text
apps/web/src/features/workspace/   Owner app (/workspace)
apps/web/src/features/client/      Client portal (/client-portal)
apps/web/src/services/             Web/desktop Supabase access
apps/web/src/shared/               Shared UI and layouts
apps/web/src-tauri/                Tauri desktop shell
apps/mobile/                       Expo app (same Auth + DB)
apps/mobile/src/lib/supabase.ts    Mobile Supabase client
apps/mobile/src/services/          Mobile table access (reminders, push)
scripts/migrations/                Shared Postgres SQL (all platforms)
docs/                              README, DESIGN, AGENTS
```

---

## Further documentation

- [DESIGN.md](./DESIGN.md) — Architecture, schema, auth, RLS, and how mobile shares the backend
- [AGENTS.md](./AGENTS.md) — Coding conventions for contributors
- [apps/web/README.md](../apps/web/README.md) — Web + Tauri build and release
- [apps/mobile/README.md](../apps/mobile/README.md) — Expo setup and Android preview builds

