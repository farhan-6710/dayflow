-- Migration 020 — Client portal access + activity raised_by.

alter table public.clients
  add column portal_enabled boolean not null default false,
  add column auth_user_id uuid references auth.users (id) on delete set null;

create unique index clients_auth_user_id_unique
  on public.clients (auth_user_id)
  where auth_user_id is not null;

alter table public.client_activity_tasks
  add column raised_by text not null default 'admin'
    check (raised_by in ('admin', 'client'));

alter table public.client_activity_meetings
  add column raised_by text not null default 'admin'
    check (raised_by in ('admin', 'client'));

alter table public.client_activity_calls
  add column raised_by text not null default 'admin'
    check (raised_by in ('admin', 'client'));

-- Client reads own client row.
create policy "Clients read their own client profile"
  on public.clients for select to authenticated
  using (auth_user_id = auth.uid());

-- Client reads projects assigned to them.
create policy "Clients read their projects"
  on public.projects for select to authenticated
  using (
    exists (
      select 1
      from public.clients c
      where c.id = projects.project_for
        and c.auth_user_id = auth.uid()
        and c.portal_enabled = true
    )
  );

-- Client reads/writes activities on their projects.
create policy "Clients read activities on their projects"
  on public.client_activity_tasks for select to authenticated
  using (
    exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
        and c.portal_enabled = true
    )
  );

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
        and c.portal_enabled = true
    )
  );

create policy "Clients update activities they raised"
  on public.client_activity_tasks for update to authenticated
  using (
    raised_by = 'client'
    and exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
    )
  )
  with check (raised_by = 'client');

create policy "Clients read meetings on their projects"
  on public.client_activity_meetings for select to authenticated
  using (
    exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
        and c.portal_enabled = true
    )
  );

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
        and c.portal_enabled = true
    )
  );

create policy "Clients update meetings they raised"
  on public.client_activity_meetings for update to authenticated
  using (
    raised_by = 'client'
    and exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
    )
  )
  with check (raised_by = 'client');

create policy "Clients read calls on their projects"
  on public.client_activity_calls for select to authenticated
  using (
    exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
        and c.portal_enabled = true
    )
  );

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
        and c.portal_enabled = true
    )
  );

create policy "Clients update calls they raised"
  on public.client_activity_calls for update to authenticated
  using (
    raised_by = 'client'
    and exists (
      select 1
      from public.projects p
      join public.clients c on c.id = p.project_for
      where p.id = project_id
        and c.auth_user_id = auth.uid()
    )
  )
  with check (raised_by = 'client');
