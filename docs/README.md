# DayFlow — Personal Workspace

DayFlow is a high-performance, beautiful personal command centre for managing tasks, project plans, calendar reminders, and notes—all in one place.

It is built for daily personal use, prioritizing speed, clean aesthetics, and simple architecture.

---

## Tech Stack

- **Frontend:** React 19, React Router 7 (SPA client-side router), Tailwind CSS v4, Framer Motion, Recharts
- **Language:** TypeScript
- **Package Manager:** Bun
- **Build System:** Vite 8
- **Backend:** Supabase (Auth, Postgres database, and Row Level Security)
- **Deployment:** Static hosting (Vite build output) + Supabase (no dedicated API/Node server)

---

## Workspace Layout

```text
dayflow/
  docs/               Project documentation, design, and developer rules
  scripts/
    migrations/       Numbered SQL migration files for Supabase
  src/
    app/              App shell, router, global styles
    services/         Supabase client, database table constants, and data fetchers
    features/         One modular directory per feature block
      auth/           Email/Password signup & login, routing protection
      dashboard/      Daily command centre, KPIs, and task completion chart
      tasks/          Task list, status & priority toggles
      projects/       Project folders with inline notes editor
      reminders/      Calendar reminders
      notifications/  Reminder and task notification inbox
      analytics/      Recharts tracking (completion rate, notes by project)
      settings/       Preferences, theme, user account profile
    shared/           Reusable cross-feature primitives
      ui/             shadcn-based UI components (buttons, dropdowns, calendars, etc.)
      components/     Global components (sidebar, headers, page wrapper, icons)
      hooks/          Global React hooks
      utils/          Global helper formatters, validators, and pure logic
```

---

## Core Features

1. **Dashboard:** A unified daily overview featuring high-level stats, a two-month task completion chart, and a focus list.
2. **Tasks:** Create, update, and manage tasks with statuses (`todo`, `in_progress`, `done`) and priorities (`low`, `medium`, `high`).
3. **Projects:** Group notes into project folders. Each project has a split-pane notes editor (list + content).
4. **Reminders:** A calendar for recurring personal reminders.
5. **Analytics:** Recharts-powered graphs for task completion and notes by project.

---

## Reference project

DayFlow’s dashboard charts, split-pane notes editor, and orange + teal accent pairing are modeled after the Digi Carotene team portal:

```text
/Users/farhan/my-work/digi-carotene-projects/digi-carotene/digi-carotene-sm-app
```

Relative from this repo:

```text
../../digi-carotene-projects/digi-carotene/digi-carotene-sm-app
```
