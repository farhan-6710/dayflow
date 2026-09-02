-- Migration 028 — Mobile app fields for reminders + Expo push tokens

alter table public.reminders
  add column if not exists status text not null default 'upcoming',
  add column if not exists category text;

alter table public.reminders
  drop constraint if exists reminders_status_check;

alter table public.reminders
  add constraint reminders_status_check
    check (status in ('done', 'upcoming', 'paused', 'missed'));

alter table public.reminders
  drop constraint if exists reminders_category_check;

alter table public.reminders
  add constraint reminders_category_check
    check (category is null or category in ('health', 'fitness', 'work', 'personal'));

update public.reminders
set status = case
  when is_disabled then 'paused'
  else coalesce(status, 'upcoming')
end
where status is null or status = 'upcoming';

create table if not exists public.expo_push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  token text not null unique,
  last_used_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists expo_push_tokens_user_id_idx
  on public.expo_push_tokens (user_id);

alter table public.expo_push_tokens enable row level security;

drop policy if exists "Users manage their expo push tokens" on public.expo_push_tokens;

create policy "Users manage their expo push tokens"
  on public.expo_push_tokens for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
