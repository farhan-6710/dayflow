-- Migration 040 — user_settings: per-user on/off preferences
-- Written at the owner's request. Owner applies this; agents never run migrations against the
-- live database. One row per signed-in user (workspace owners and portal clients alike),
-- created by the app on the first toggle. A missing row means every default below.

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  page_transitions boolean not null default true,
  in_app_reminders boolean not null default true,
  email_updates boolean not null default true,
  desktop_alerts boolean not null default true,
  weekly_digest boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own" on public.user_settings
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own" on public.user_settings
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own" on public.user_settings
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on table public.user_settings from anon;
grant select, insert, update on table public.user_settings to authenticated;

drop trigger if exists user_settings_updated_at on public.user_settings;
create trigger user_settings_updated_at
  before update on public.user_settings
  for each row
  execute function public.handle_updated_at();
