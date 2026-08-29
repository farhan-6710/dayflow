-- Migration 018 — clients.user_id → admin_id (admin portal owner).

alter table public.clients rename column user_id to admin_id;

drop index if exists clients_user_id_idx;
create index clients_admin_id_idx on public.clients (admin_id);

drop index if exists clients_is_active_idx;
create index clients_is_active_idx on public.clients (admin_id, is_active);

drop index if exists clients_user_email_unique;
create unique index clients_admin_email_unique
  on public.clients (admin_id, lower(trim(email)))
  where email is not null;

drop policy if exists "Users own their clients" on public.clients;

create policy "Admins own their clients"
  on public.clients for all to authenticated
  using (admin_id = auth.uid()) with check (admin_id = auth.uid());

drop policy if exists "Users own their client conversation messages" on public.client_conversation_messages;

create policy "Admins manage client conversation messages"
  on public.client_conversation_messages for all to authenticated
  using (
    exists (
      select 1
      from public.clients c
      where c.id = client_id
        and c.admin_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.clients c
      where c.id = client_id
        and c.admin_id = auth.uid()
    )
  );
