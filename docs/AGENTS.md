# Agent Guidelines — DayFlow

This file contains the strict coding rules and conventions that all developers and AI agents must follow when modifying the DayFlow codebase.

---

## Core Philosophy

- **Simplicity Over Everything:** No over-engineering. Do not build for multi-tenancy, team collaboration, or enterprise scaling. DayFlow is a **personal single-user app**.
- **Least Code, More Output:** Prefer the smallest possible change that solves the problem. Don't add unnecessary files, extra wrappers, or layers of indirection.
- **Beginner-Friendly Code:** Code should read cleanly. Avoid clever one-liners or highly abstract patterns. Use flat, self-documenting functions with clear naming. One function should do exactly one job.
- **Strict Domain Separation:** Keep features decoupled in their respective `features/` directory. Only use shared components and utility files inside `src/shared/`.

---

## Directory Architecture

All code must reside in the standard structure:

```text
src/
  app/          Vite entry point, Global App layout shell, Client Router (React Router 7)
  services/     Database/API layer. All Supabase calls live here. Nothing else imports the client.
  features/     Self-contained domain directories containing:
    components/   Presentational UI components
    constants/    Domain-specific static data, routes, enums, Magic Numbers
    hooks/        Stateful logic hooks (strictly one concern per hook)
    pages/        Top-level routing views composing hooks + presentational components
    types/        Feature types (types.ts for domain models, components.ts for props)
    utils/        Feature-specific validation, parsing, formatters (no Supabase)
  shared/       Reusable primitives across features (ui/, components/, layouts/, hooks/, utils/)
```

---

## Database & API (Supabase) Rules

- **Zero Inline Supabase Calls:** Every single Supabase database or authentication call must reside in `src/services/`. No feature components, hooks, or pages can import the supabase client.
- **No Table-name Strings in Code:** Define table names and select templates in `src/services/db.ts` (e.g. `DB.TASKS.TABLE`, `DB.TASKS.SELECT`). Always import and reference the constants.
- **Row Level Security (RLS) is Law:** Every table MUST have RLS enabled, ensuring only the owner can query, update, or delete rows: `auth.uid() = user_id`.
- **Simplified SQL:** Keep DB operations basic. Avoid recursive queries, database RPCs, triggers, or audit logs unless specifically needed. One query per operation.

---

## Component & Hook Conventions

- **Keep Components Presentational:** Keep `.tsx` files light (~120 lines max). Extract complex state management, mutations, and side effects into custom hooks.
- **Separation of Concerns in Hooks:** Write hooks that do exactly one thing (e.g., `useTasksQuery` to fetch, `useTaskDialog` for form inputs + mutate actions). Comcompose them in the page component.
- **Strict Prop Typing:** Prop types should be placed in `types/components.ts` under the feature directory. Always prefix component names to prop type names (e.g. `TaskCardProps`).
- **No Magic Values in UI:** Put all select dropdown arrays, priority classes, date range filters, and layout classes in custom constant files.

---

## UI, UX & Styling

- **Tailwind v4:** Use modern, utility-first styling. Use CSS variables defined in the theme for colors and typography.
- **Framer Motion:** All page changes must use smooth, clean slide-fade transitions via `TransitionLink` and the layout shell. Keep in-page transitions fast and snappy.
- **Action Confirmation:** Always prompt the user with a `ConfirmationModal` before destructive or hard-to-undo actions (like deleting a task, project, or note).
- **Toasts:** Use `showToast(type, message)` (`success`, `error`, `info`) after completing any API mutation (create/update/delete) or on failure.
- **Loading & Empty States:** Ensure every query page has a smooth skeleton loading state and a beautiful, actionable empty state illustration.
