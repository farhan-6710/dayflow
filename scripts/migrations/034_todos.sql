-- Migration 034 — Todos
-- Simple checklist items for the workspace dashboard (no due date/time).

create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index todos_user_id_idx on public.todos (user_id);
create index todos_user_id_status_idx on public.todos (user_id, status);

create trigger set_todos_updated_at
  before update on public.todos
  for each row
  execute function public.handle_updated_at();

alter table public.todos enable row level security;

create policy "Users own their todos"
  on public.todos for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
