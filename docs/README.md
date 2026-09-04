![Dayflow Banner](../apps/web/public/brand-promotion-banner-img-dark.png)

# DayFlow — Workspace, Client Portal & Mobile

DayFlow is a workspace for personal day-to-day use and freelancers. Manage tasks, projects, clients, and reminders; give clients a portal to view shared work and raise activities.

**Platforms:** Web · Desktop (macOS, Tauri) · Mobile (Android via Expo; iOS coming soon)

---

## Try DayFlow (web)

### 1. Open the live app

**[https://bisque-gull-237581.hostingersite.com](https://bisque-gull-237581.hostingersite.com)**

### 2. Sign in to the workspace with the demo account

Go to **[Workspace login](https://bisque-gull-237581.hostingersite.com/workspace/auth)** (owner portal; `/admin-portal` redirects here) and use:

| Field | Value |
|-------|-------|
| Email | `dayflow.demo@gmail.com` |
| Password | `D@1234` |

You’ll land on the workspace dashboard — tasks, projects, clients, reminders, notifications, and analytics.

The **same credentials** work on the desktop app and the Android app. They all talk to one Supabase project.

### 3. Client portal (optional)

Clients sign in at **[Client portal login](https://bisque-gull-237581.hostingersite.com/client-portal/auth)** with an email linked to a client record in the demo workspace.

---

## Install DayFlow (macOS desktop)

### 1. Download

Get the latest `.dmg` from [GitHub Releases](https://github.com/farhan-6710/dayflow/releases).

### 2. Install

1. Open the downloaded `.dmg`
2. Drag **DayFlow** into **Applications**

### 3. First launch on macOS

macOS may block unsigned apps with a “damaged” warning. Fix it once:

**Option A — Right-click:** Applications → right-click **DayFlow** → **Open** → **Open**

**Option B — Terminal:**

```bash
xattr -cr /Applications/DayFlow.app
```

Then open DayFlow normally and sign in with the same demo credentials above.

**Google sign-in on desktop:** opens your system browser, then returns to the app via a deep link (`dayflow://`). Deep links work in the **installed** `.app` — rebuild and reinstall after OAuth-related updates.

---

## Install DayFlow (mobile)

Preview builds are distributed with Expo internal distribution (not the App Store / Play Store yet).

| Platform | Download |
|----------|----------|
| **Android** | [Install preview APK](https://expo.dev/accounts/farhan_6710/projects/personal-assistant-app/builds/d5d3cb5c-e0c1-4840-8c19-8f742cca572d) |
| **Apple (iOS)** | Coming soon |

Open the Android link **on an Android phone**, tap **Install**, and allow installs from Expo if prompted. Sign in with the same demo account as the web and desktop apps.

---

## One backend: shared Supabase

Web, desktop, and mobile are three clients of **one** Supabase project. There is no per-platform database and no sync layer to keep in agreement — Postgres is the source of truth, Auth issues the session, and Row Level Security decides what each user can see.

```text
                    ┌─────────────────────────────────────────┐
  Web (Vite)        │                                         │
  Desktop (Tauri    │   Supabase                              │
    wraps the same  │     • Auth  (email / Google)            │
    React app)      │     • Postgres (one schema)             │
                    │     • RLS policies on every table       │
  Mobile (Expo)     │                                         │
                    └─────────────────────────────────────────┘
```

| Piece | How it is shared |
|-------|------------------|
| **Project** | One hosted Supabase URL + anon key. Web reads `VITE_SUPABASE_*`; mobile reads `EXPO_PUBLIC_SUPABASE_*` (EAS env on release builds). Same values, different env prefixes. |
| **Auth** | `supabase.auth.signInWithPassword` (and Google OAuth on web/desktop). A session is `auth.uid()`. Sign in on your phone with the workspace owner account and you are the same user as in the browser. |
| **Schema** | All SQL lives in `scripts/migrations/` and is applied once to the shared database. Mobile did not get a second schema — it added columns/tables (`reminders.status`, `expo_push_tokens`, `reminder_occurrences`) that web/desktop also use. |
| **Access** | RLS is the API. Workspace rows are scoped with `user_id = auth.uid()` (or `owner_user_id` for clients). The client portal uses RPCs (`link_client_portal_user`, `fetch_client_portal_projects`) so clients never own `projects` rows. Both apps go through the same policies — a compromised client still cannot read another user’s data. |
| **Clients in code** | Web/desktop: `apps/web/src/services/` → `@supabase/supabase-js`. Mobile: `apps/mobile/src/lib/supabase.ts` + `apps/mobile/src/services/`. Table names stay in each app’s `db.ts`, mapped to the **same** Postgres tables (`reminders`, `profiles`, …). |

**What each surface uses today**

- **Web + desktop** — full product: workspace (tasks, projects, clients, reminders, analytics) and client portal.
- **Mobile** — owner workspace reminders, local scheduling, and Expo push (`reminders`, `reminder_occurrences`, `expo_push_tokens`). Same owner `user_id`, so a reminder you pause on mobile is paused on desktop.

That is the consistency story for an interviewer: one Auth user, one Postgres, RLS as the contract, two (soon three) first-party clients.

---

## What it does

| Surface | Path / app | Who |
|---------|------------|-----|
| **Workspace** | `/workspace` (web & desktop) | Owner — tasks, projects, clients, reminders, analytics |
| **Client portal** | `/client-portal` (web & desktop) | Client — shared projects, raise tasks / meetings / calls |
| **Mobile** | Expo app | Owner — reminders + push, same Supabase user as workspace |

**Highlights:** Supabase Auth (email + Google OAuth) · dual-portal RLS · client activities (`raised_by`: workspace \| client) · in-app notifications · Expo push tokens · optimistic UI · analytics charts · Tauri desktop · Expo Android preview

---

## Tech stack

| Layer | Stack |
|-------|--------|
| **Web & desktop UI** | React 19 · TypeScript · Vite · Tailwind v4 · shadcn/ui · Framer Motion · Recharts |
| **Desktop shell** | Tauri 2 (macOS) wrapping the Vite app |
| **Mobile** | React Native · Expo (Expo Router) · NativeWind |
| **Backend** | Supabase (Auth, Postgres, RLS) — shared by every client |
| **Tooling** | Bun (web) · EAS Build (mobile) |
| **Planned** | PHP (Hostinger) — transactional emails and cron jobs |

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

## Further reading

- [DESIGN.md](./DESIGN.md) — Architecture, schema, auth, RLS, and how mobile shares the backend
- [AGENTS.md](./AGENTS.md) — Coding conventions for contributors
- [apps/web/README.md](../apps/web/README.md) — Web + Tauri build and release
- [apps/mobile/README.md](../apps/mobile/README.md) — Expo setup and Android preview builds
