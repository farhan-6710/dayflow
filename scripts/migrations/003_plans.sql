-- Migration 003 — Plans
-- Create plans table for grouping tasks under milestones / phases inside a project.

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index plans_user_id_idx on public.plans (user_id);
create index plans_project_id_idx on public.plans (project_id);

create trigger set_plans_updated_at
  before update on public.plans
  for each row
  execute function public.handle_updated_at();

alter table public.plans enable row level security;

create policy "Users own their plans"
  on public.plans for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
