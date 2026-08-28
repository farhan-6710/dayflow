-- Migration 013 — Project reference links (V1).

create table public.project_reference_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  url text not null,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_project_reference_links_updated_at
  before update on public.project_reference_links
  for each row
  execute function public.handle_updated_at();

alter table public.project_reference_links enable row level security;

create policy "Users own their project reference links"
  on public.project_reference_links for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
