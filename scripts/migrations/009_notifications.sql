-- Migration 009 — In-app notifications inbox (reminder alerts)

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  notification_type text not null
    check (notification_type in ('reminder', 'task')),
  title text not null,
  message text not null,
  status text not null default 'unread'
    check (status in ('unread', 'read')),
  related_id uuid,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index notifications_user_status_created_idx
  on public.notifications (user_id, status, created_at desc);

alter table public.notifications enable row level security;

create policy "Users own their notifications"
  on public.notifications for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
