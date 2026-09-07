-- Migration 028 — One row per reminder per day (done or missed)
-- (formerly 029; renumbered after failed workspace terminology migration)

create table if not exists public.reminder_occurrences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  reminder_id uuid not null references public.reminders (id) on delete cascade,
  occurrence_date date not null,
  status text not null check (status in ('done', 'missed')),
  unique (reminder_id, occurrence_date)
);

alter table public.reminder_occurrences enable row level security;

drop policy if exists "Users own their reminder occurrences"
  on public.reminder_occurrences;

create policy "Users own their reminder occurrences"
  on public.reminder_occurrences for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
