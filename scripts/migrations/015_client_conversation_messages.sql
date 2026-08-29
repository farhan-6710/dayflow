-- Migration 015 — Client conversation messages (V1).
-- One table for the full admin ↔ client thread (like task_messages in digi-carotene).
-- Admin sends: author_admin_id set. Client sends (portal): author_client_id set.

create table public.client_conversation_messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  author_admin_id uuid references public.profiles (id) on delete restrict,
  author_client_id uuid references public.clients (id) on delete restrict,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_conversation_messages_author_check check (
    (author_admin_id is not null and author_client_id is null)
    or (author_admin_id is null and author_client_id is not null)
  )
);

create trigger set_client_conversation_messages_updated_at
  before update on public.client_conversation_messages
  for each row
  execute function public.handle_updated_at();

alter table public.client_conversation_messages enable row level security;

create policy "Users own their client conversation messages"
  on public.client_conversation_messages for all to authenticated
  using (
    exists (
      select 1
      from public.clients c
      where c.id = client_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.clients c
      where c.id = client_id
        and c.user_id = auth.uid()
    )
  );
