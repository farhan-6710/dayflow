-- Migration 031 — Replace projects.is_archived with is_active

alter table public.projects
  add column if not exists is_active boolean not null default true;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'is_archived'
  ) then
    update public.projects
    set is_active = not is_archived;

    alter table public.projects
      drop column is_archived;
  end if;
end $$;

-- Recreate client portal RPC to return is_active instead of is_archived
drop function if exists public.fetch_client_portal_projects();

create or replace function public.fetch_client_portal_projects()
returns table (
  id uuid,
  user_id uuid,
  name text,
  color_hex text,
  is_active boolean,
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
    p.is_active,
    p.project_for,
    p.created_at,
    p.updated_at
  from public.projects p
  inner join public.clients c on c.id = p.project_for
  where p.is_active = true
    and c.is_active = true
    and c.email is not null
    and lower(trim(c.email)) = v_email
  order by p.name;
end;
$$;

revoke all on function public.fetch_client_portal_projects() from public;
grant execute on function public.fetch_client_portal_projects() to authenticated;
