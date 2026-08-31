-- Migration 027 — Workspace terminology in schema (Phase 2).
-- admin_id → owner_user_id, author_admin_id → author_user_id, raised_by 'admin' → 'workspace'.

-- ---------------------------------------------------------------------------
-- Activity raised_by
-- ---------------------------------------------------------------------------

update public.client_activity_tasks
set raised_by = 'workspace'
where raised_by = 'admin';

update public.client_activity_meetings
set raised_by = 'workspace'
where raised_by = 'admin';

update public.client_activity_calls
set raised_by = 'workspace'
where raised_by = 'admin';

alter table public.client_activity_tasks
  alter column raised_by set default 'workspace';

alter table public.client_activity_meetings
  alter column raised_by set default 'workspace';

alter table public.client_activity_calls
  alter column raised_by set default 'workspace';

alter table public.client_activity_tasks
  drop constraint if exists client_activity_tasks_raised_by_check;

alter table public.client_activity_tasks
  add constraint client_activity_tasks_raised_by_check
  check (raised_by in ('workspace', 'client'));

alter table public.client_activity_meetings
  drop constraint if exists client_activity_meetings_raised_by_check;

alter table public.client_activity_meetings
  add constraint client_activity_meetings_raised_by_check
  check (raised_by in ('workspace', 'client'));

alter table public.client_activity_calls
  drop constraint if exists client_activity_calls_raised_by_check;

alter table public.client_activity_calls
  add constraint client_activity_calls_raised_by_check
  check (raised_by in ('workspace', 'client'));

-- ---------------------------------------------------------------------------
-- clients.admin_id → owner_user_id
-- ---------------------------------------------------------------------------

alter table public.clients rename column admin_id to owner_user_id;

drop index if exists clients_admin_id_idx;
create index clients_owner_user_id_idx on public.clients (owner_user_id);

drop index if exists clients_is_active_idx;
create index clients_is_active_idx on public.clients (owner_user_id, is_active);

drop index if exists clients_admin_email_unique;
create unique index clients_owner_email_unique
  on public.clients (owner_user_id, lower(trim(email)))
  where email is not null;

drop policy if exists "Admins own their clients" on public.clients;

create policy "Workspace owners own their clients"
  on public.clients for all to authenticated
  using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- client_conversation_messages.author_admin_id → author_user_id
-- ---------------------------------------------------------------------------

drop policy if exists "Admins manage client conversation messages"
  on public.client_conversation_messages;

alter table public.client_conversation_messages
  rename column author_admin_id to author_user_id;

create policy "Workspace owners manage client conversation messages"
  on public.client_conversation_messages for all to authenticated
  using (
    exists (
      select 1
      from public.clients c
      where c.id = client_id
        and c.owner_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.clients c
      where c.id = client_id
        and c.owner_user_id = auth.uid()
    )
  );
