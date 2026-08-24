-- Migration 008 — Recurring reminders for the calendar

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  reminder_time text not null,
  days_of_week text[] not null default '{}'::text[],
  is_disabled boolean not null default false,
  disabled_until date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reminders_days_of_week_check check (
    days_of_week <@ array['mon','tue','wed','thu','fri','sat','sun']::text[]
  )
);

create index reminders_user_id_idx on public.reminders (user_id);

create trigger set_reminders_updated_at
  before update on public.reminders
  for each row
  execute function public.handle_updated_at();

alter table public.reminders enable row level security;

create policy "Users own their reminders"
  on public.reminders for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
