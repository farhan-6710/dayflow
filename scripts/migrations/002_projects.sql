-- Migration 002 — Projects
-- Create projects table to group tasks and plans.

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  color_hex text not null default '#ff7e21',
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_user_id_idx on public.projects (user_id);

create trigger set_projects_updated_at
  before update on public.projects
  for each row
  execute function public.handle_updated_at();

alter table public.projects enable row level security;

create policy "Users own their projects"
  on public.projects for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
