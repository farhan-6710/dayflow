-- Migration 017 — Drop legacy client_messages (use client_conversation_messages).

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
