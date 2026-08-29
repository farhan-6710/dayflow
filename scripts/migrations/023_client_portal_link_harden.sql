-- Migration 023 — Harden client portal linking (email fallbacks + bypass RLS).

create or replace function public.link_client_portal_user()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_email text;
  v_client public.clients%rowtype;
begin
  if v_user_id is null then
    return null;
  end if;

  select lower(trim(coalesce(
    u.email,
    u.raw_user_meta_data ->> 'email',
    u.raw_app_meta_data ->> 'email'
  )))
  into v_email
  from auth.users u
  where u.id = v_user_id;

  if v_email is null or v_email = '' then
    v_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  end if;

  if v_email is null or v_email = '' then
    return null;
  end if;

  select *
  into v_client
  from public.clients c
  where c.auth_user_id = v_user_id
    and c.is_active = true
    and c.email is not null
  limit 1;

  if found then
    return row_to_json(v_client);
  end if;

  update public.clients c
  set auth_user_id = v_user_id,
      updated_at = now()
  where c.id = (
    select c2.id
    from public.clients c2
    where c2.auth_user_id is null
      and c2.is_active = true
      and c2.email is not null
      and lower(trim(c2.email)) = v_email
    order by c2.created_at asc
    limit 1
  )
  returning * into v_client;

  if not found then
    return null;
  end if;

  return row_to_json(v_client);
end;
$$;

revoke all on function public.link_client_portal_user() from public;
grant execute on function public.link_client_portal_user() to authenticated;
