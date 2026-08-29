-- Migration 021 — Remove portal_enabled; allow clients to self-link by email via RLS.

alter table public.clients drop column if exists portal_enabled;

-- Find an unlinked client row whose email matches the signed-in user.
create policy "Clients find unlinked profile by email"
  on public.clients for select to authenticated
  using (
    auth_user_id is null
    and email is not null
    and is_active = true
    and lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

-- Link auth.users.id onto the matching client row (first login).
create policy "Clients link their profile"
  on public.clients for update to authenticated
  using (
    auth_user_id is null
    and email is not null
    and is_active = true
    and lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  )
  with check (
    auth_user_id = auth.uid()
    and email is not null
    and is_active = true
  );

drop policy if exists "Clients read their projects" on public.projects;
create policy "Clients read their projects"
  on public.projects for select to authenticated
  using (
    exists (
      select 1
      from public.clients c
      where c.id = projects.project_for
        and c.auth_user_id = auth.uid()
        and c.email is not null
        and c.is_active = true
    )
  );

drop policy if exists "Clients read activities on their projects" on public.client_activity_tasks;
create policy "Clients read activities on their projects"
  on public.client_activity_tasks for select to authenticated
  using (
    exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
        and c.email is not null
        and c.is_active = true
    )
  );

drop policy if exists "Clients insert activities on their projects" on public.client_activity_tasks;
create policy "Clients insert activities on their projects"
  on public.client_activity_tasks for insert to authenticated
  with check (
    raised_by = 'client'
    and exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
        and c.email is not null
        and c.is_active = true
    )
  );

drop policy if exists "Clients read meetings on their projects" on public.client_activity_meetings;
create policy "Clients read meetings on their projects"
  on public.client_activity_meetings for select to authenticated
  using (
    exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
        and c.email is not null
        and c.is_active = true
    )
  );

drop policy if exists "Clients insert meetings on their projects" on public.client_activity_meetings;
create policy "Clients insert meetings on their projects"
  on public.client_activity_meetings for insert to authenticated
  with check (
    raised_by = 'client'
    and exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
        and c.email is not null
        and c.is_active = true
    )
  );

drop policy if exists "Clients read calls on their projects" on public.client_activity_calls;
create policy "Clients read calls on their projects"
  on public.client_activity_calls for select to authenticated
  using (
    exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
        and c.email is not null
        and c.is_active = true
    )
  );

drop policy if exists "Clients insert calls on their projects" on public.client_activity_calls;
create policy "Clients insert calls on their projects"
  on public.client_activity_calls for insert to authenticated
  with check (
    raised_by = 'client'
    and exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
        and c.email is not null
        and c.is_active = true
    )
  );
