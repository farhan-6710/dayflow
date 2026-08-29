-- Migration 016 — Replace legacy client_messages with client_conversation_messages.
-- Run if you already applied the old client_messages migration (user_id + sender_type).

create table if not exists public.client_conversation_messages (
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

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'client_messages'
  ) then
    insert into public.client_conversation_messages (
      id,
      client_id,
      author_admin_id,
      author_client_id,
      body,
      created_at,
      updated_at
    )
    select
      m.id,
      m.client_id,
      case when m.sender_type = 'user' then m.user_id else null end,
      case when m.sender_type = 'client' then m.client_id else null end,
      m.body,
      m.created_at,
      m.updated_at
    from public.client_messages m
    where not exists (
      select 1
      from public.client_conversation_messages existing
      where existing.id = m.id
    );

    drop trigger if exists set_client_messages_updated_at on public.client_messages;
    drop table public.client_messages cascade;
  end if;
end $$;

drop trigger if exists set_client_conversation_messages_updated_at on public.client_conversation_messages;

create trigger set_client_conversation_messages_updated_at
  before update on public.client_conversation_messages
  for each row
  execute function public.handle_updated_at();

alter table public.client_conversation_messages enable row level security;

drop policy if exists "Users own their client conversation messages" on public.client_conversation_messages;

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
