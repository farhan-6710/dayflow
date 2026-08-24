-- Migration 005 — Notes
-- Create notes table for rich notes optionally grouped inside projects.

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  project_id uuid references public.projects (id) on delete cascade,
  title text not null,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index notes_user_id_idx on public.notes (user_id);
create index notes_project_id_idx on public.notes (project_id);

create trigger set_notes_updated_at
  before update on public.notes
  for each row
  execute function public.handle_updated_at();

alter table public.notes enable row level security;

create policy "Users own their notes"
  on public.notes for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
