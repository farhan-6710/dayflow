-- Migration 004 — Tasks
-- Create tasks table with status, priority, due date/time, and reminders.

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete cascade,
  plan_id uuid references public.plans (id) on delete set null,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  due_time text,
  reminder_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_user_id_idx on public.tasks (user_id);
create index tasks_project_id_idx on public.tasks (project_id);
create index tasks_plan_id_idx on public.tasks (plan_id);
create index tasks_due_date_idx on public.tasks (due_date);

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();

alter table public.tasks enable row level security;

create policy "Users own their tasks"
  on public.tasks for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
