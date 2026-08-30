-- Migration 026 — Client portal project + activity access helpers.
-- Fixes empty projects/activities when JWT email claim is missing (common after magic link)
-- and when nested RLS subqueries block activity reads.

create or replace function public.client_portal_resolved_email()
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_email text;
  v_uid uuid := auth.uid();
begin
  v_email := nullif(lower(trim(coalesce(auth.jwt() ->> 'email', ''))), '');

  if v_email is not null then
    return v_email;
  end if;

  if v_uid is null then
    return null;
  end if;

  select lower(trim(coalesce(
    u.email,
    u.raw_user_meta_data ->> 'email',
    u.raw_app_meta_data ->> 'email'
  )))
  into v_email
  from auth.users u
  where u.id = v_uid;

  return nullif(v_email, '');
end;
$$;

revoke all on function public.client_portal_resolved_email() from public;
grant execute on function public.client_portal_resolved_email() to authenticated;

create or replace function public.client_portal_can_access_project(p_project_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
begin
  if v_uid is null or p_project_id is null then
    return false;
  end if;

  v_email := public.client_portal_resolved_email();

  return exists (
    select 1
    from public.projects p
    inner join public.clients c on c.id = p.project_for
    where p.id = p_project_id
      and c.is_active = true
      and c.email is not null
      and (
        c.auth_user_id = v_uid
        or (
          v_email is not null
          and lower(trim(c.email)) = v_email
        )
      )
  );
end;
$$;

revoke all on function public.client_portal_can_access_project(uuid) from public;
grant execute on function public.client_portal_can_access_project(uuid) to authenticated;

-- Backwards-compatible alias used by migration 025.
create or replace function public.client_portal_session_email()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select public.client_portal_resolved_email();
$$;

revoke all on function public.client_portal_session_email() from public;
grant execute on function public.client_portal_session_email() to authenticated;

create or replace function public.fetch_client_portal_projects()
returns table (
  id uuid,
  user_id uuid,
  name text,
  color_hex text,
  is_archived boolean,
  project_for uuid,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
begin
  v_email := public.client_portal_resolved_email();

  if v_email is null then
    return;
  end if;

  return query
  select
    p.id,
    p.user_id,
    p.name,
    p.color_hex,
    p.is_archived,
    p.project_for,
    p.created_at,
    p.updated_at
  from public.projects p
  inner join public.clients c on c.id = p.project_for
  where p.is_archived = false
    and c.is_active = true
    and c.email is not null
    and lower(trim(c.email)) = v_email
  order by p.name;
end;
$$;

revoke all on function public.fetch_client_portal_projects() from public;
grant execute on function public.fetch_client_portal_projects() to authenticated;

drop policy if exists "Clients read their projects" on public.projects;
create policy "Clients read their projects"
  on public.projects for select to authenticated
  using (public.client_portal_can_access_project(id));

drop policy if exists "Clients read activities on their projects" on public.client_activity_tasks;
create policy "Clients read activities on their projects"
  on public.client_activity_tasks for select to authenticated
  using (public.client_portal_can_access_project(project_id));

drop policy if exists "Clients insert activities on their projects" on public.client_activity_tasks;
create policy "Clients insert activities on their projects"
  on public.client_activity_tasks for insert to authenticated
  with check (
    raised_by = 'client'
    and public.client_portal_can_access_project(project_id)
  );

drop policy if exists "Clients update activities they raised" on public.client_activity_tasks;
create policy "Clients update activities they raised"
  on public.client_activity_tasks for update to authenticated
  using (
    raised_by = 'client'
    and public.client_portal_can_access_project(project_id)
  )
  with check (raised_by = 'client');

drop policy if exists "Clients read meetings on their projects" on public.client_activity_meetings;
create policy "Clients read meetings on their projects"
  on public.client_activity_meetings for select to authenticated
  using (public.client_portal_can_access_project(project_id));

drop policy if exists "Clients insert meetings on their projects" on public.client_activity_meetings;
create policy "Clients insert meetings on their projects"
  on public.client_activity_meetings for insert to authenticated
  with check (
    raised_by = 'client'
    and public.client_portal_can_access_project(project_id)
  );

drop policy if exists "Clients update meetings they raised" on public.client_activity_meetings;
create policy "Clients update meetings they raised"
  on public.client_activity_meetings for update to authenticated
  using (
    raised_by = 'client'
    and public.client_portal_can_access_project(project_id)
  )
  with check (raised_by = 'client');

drop policy if exists "Clients read calls on their projects" on public.client_activity_calls;
create policy "Clients read calls on their projects"
  on public.client_activity_calls for select to authenticated
  using (public.client_portal_can_access_project(project_id));

drop policy if exists "Clients insert calls on their projects" on public.client_activity_calls;
create policy "Clients insert calls on their projects"
  on public.client_activity_calls for insert to authenticated
  with check (
    raised_by = 'client'
    and public.client_portal_can_access_project(project_id)
  );

drop policy if exists "Clients update calls they raised" on public.client_activity_calls;
create policy "Clients update calls they raised"
  on public.client_activity_calls for update to authenticated
  using (
    raised_by = 'client'
    and public.client_portal_can_access_project(project_id)
  )
  with check (raised_by = 'client');
