-- Migration 025 — Fix client portal 403 on projects/activities.
-- Migration 024 RLS referenced auth.users directly; the authenticated role
-- cannot SELECT auth.users and PostgREST returns 42501.
-- Use JWT email in RLS instead. Keep auth.users reads inside security definer RPCs only.

create or replace function public.client_portal_session_email()
returns text
language sql
stable
as $$
  select nullif(lower(trim(coalesce(auth.jwt() ->> 'email', ''))), '');
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
  v_user_id uuid := auth.uid();
  v_email text;
begin
  if v_user_id is null then
    return;
  end if;

  v_email := public.client_portal_session_email();

  if v_email is null then
    select lower(trim(coalesce(
      u.email,
      u.raw_user_meta_data ->> 'email',
      u.raw_app_meta_data ->> 'email'
    )))
    into v_email
    from auth.users u
    where u.id = v_user_id;
  end if;

  if v_email is null or v_email = '' then
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
  using (
    exists (
      select 1
      from public.clients c
      where c.id = projects.project_for
        and c.is_active = true
        and c.email is not null
        and (
          c.auth_user_id = auth.uid()
          or (
            public.client_portal_session_email() is not null
            and lower(trim(c.email)) = public.client_portal_session_email()
          )
        )
    )
  );
