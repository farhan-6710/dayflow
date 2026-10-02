-- Migration 032 — Reference links for notes (same shape as project_reference_links)

create table public.note_reference_links (
  id uuid primary key default gen_random_uuid(),
  note_id uuid not null references public.notes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  url text not null,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index note_reference_links_note_id_idx
  on public.note_reference_links (note_id);

create trigger set_note_reference_links_updated_at
  before update on public.note_reference_links
  for each row
  execute function public.handle_updated_at();

alter table public.note_reference_links enable row level security;

create policy "Users own their note reference links"
  on public.note_reference_links for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
