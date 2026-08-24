# Architecture & Design — DayFlow

This guide explains the software design, database schemas, and global patterns of DayFlow.

---

## Data Flow Pattern

Data in DayFlow travels in a strict, predictable one-way cycle:

```text
Database (Supabase)
      ▲
      │ (API Call)
src/services/ (supabase client functions)
      ▲
      │ (exposes data, actions & loading state)
customHook.ts (features/domain/hooks)
      ▲
      │ (composes hooks and passes props)
PageView.tsx (features/domain/pages)
      ├──► PresentationalComponent.tsx (features/domain/components)
```

1. **Pages** represent the top-level route views. They load data, hold routing logic, and act as high-level orchestrators. They don't contain raw HTML or style-heavy divs—they delegate everything to components.
2. **Components** are presentational. They receive data and event handlers via typed props, render the interface, and style using Tailwind CSS.
3. **Hooks** contain business logic. They connect Pages to Services, manage input fields, handle validation, trigger alerts, and run loading state managers.
4. **Services** execute raw queries and operations against Supabase. They map response rows to structured TypeScript domain types.

---

## Database Schema (Postgres)

All tables live in the public schema of Postgres, using UUID primary keys.

```text
┌─────────────────┐
│    profiles     │
├─────────────────┤
│ id (PK, auth)   │
│ display_name    │
│ avatar_url      │
│ theme_preference│
└────────┬────────┘
         │ (1:many)
         ├───┐
         │   │
         ▼   ▼
┌─────────────────┐        ┌─────────────────┐
│    projects     │        │      notes      │
├─────────────────┤        ├─────────────────┤
│ id (PK)         │◄──┐    │ id (PK)         │
│ user_id (FK)    │   │    │ user_id (FK)    │
│ name            │   │    │ project_id (FK) │
│ color_hex       │   │    │ title           │
│ is_archived     │   │    │ body            │
└────────┬────────┘   │    └─────────────────┘
         │            │
         │ (1:many)   │ (1:many)
         ▼            │
┌─────────────────┐   │
│      plans      │   │
├─────────────────┤   │
│ id (PK)         │   │
│ project_id (FK) │   │
│ title           │   │
│ sort_order      │   │
└────────┬────────┘   │
         │            │
         │ (1:many)   │
         ▼            │
┌─────────────────┐   │
│      tasks      │───┘
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ project_id (FK?)│
│ plan_id (FK?)   │
│ title           │
│ description     │
│ status          │
│ priority        │
│ due_date        │
│ due_time        │
│ reminder_at     │
└─────────────────┘
```

### Table Definitions

1. **profiles:** Automatically created when a user signs up. Holds profile preferences.
2. **projects:** Groups of related goals or workflows. Custom colors can be chosen.
3. **plans:** Mid-level groupings (milestones, iterations, or categories) belonging to a specific project.
4. **tasks:** Individual action items. Can belong to a project, a plan, or exist independently (Inbox).
5. **notes:** Personal notes, optionally categorized under a project.

---

## Row Level Security (RLS) Policy Blueprint

All tables are locked down. The policy ensures that a user can only perform operations on rows where the `user_id` matches their authenticated session ID.

```sql
-- Standard RLS setup
alter table public.tasks enable row level security;

create policy "Users own their tasks"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

Since DayFlow is a personal workspace, **there is no cross-user data sharing**. This simplifies policies and prevents accidental data exposure.

---

## Authentication & Route Protection

Routing and page layout use standard client-side guards:

- **Unauthenticated / AuthRoute:** Redirects back to `/dashboard` if a user has a valid active session.
- **Authenticated / AppRoute:** Redirects back to `/auth` if no valid session exists.
- **Route Layout Shell:** Controls state transitions. The persistent sidebar and top search bar exist inside the protected route layout, containing the children within a smooth animated page container.
