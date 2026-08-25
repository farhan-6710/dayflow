-- Migration 011 — Clients (freelance / work contacts for DayFlow)

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  client_name text not null,
  email text,
  primary_contact_name text,
  mobile_number text,
  secondary_contact_name text,
  secondary_mobile_number text,
  website_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_user_id_idx on public.clients (user_id);
create index clients_is_active_idx on public.clients (user_id, is_active);

create unique index clients_user_email_unique
  on public.clients (user_id, lower(trim(email)))
  where email is not null;

create trigger set_clients_updated_at
  before update on public.clients
  for each row
  execute function public.handle_updated_at();

alter table public.clients enable row level security;

create policy "Users own their clients"
  on public.clients for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
