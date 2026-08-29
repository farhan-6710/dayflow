-- Migration 019 — Client project activities (tasks, meetings, calls).
-- Scoped to projects where project_for is set. Open vs closed is client-side (status !== completed).

create table public.client_activity_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  priority text not null check (priority in ('low', 'medium', 'high')),
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  eta_date date not null,
  eta_time text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index client_activity_tasks_project_id_idx
  on public.client_activity_tasks (project_id);

create trigger set_client_activity_tasks_updated_at
  before update on public.client_activity_tasks
  for each row
  execute function public.handle_updated_at();

alter table public.client_activity_tasks enable row level security;

create policy "Users manage client activity tasks on their projects"
  on public.client_activity_tasks for all to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  );

create table public.client_activity_meetings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  from_date date not null,
  from_time text not null,
  to_date date not null,
  to_time text not null,
  venue text not null
    check (venue in ('client_location', 'in_office', 'online')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index client_activity_meetings_project_id_idx
  on public.client_activity_meetings (project_id);

create trigger set_client_activity_meetings_updated_at
  before update on public.client_activity_meetings
  for each row
  execute function public.handle_updated_at();

alter table public.client_activity_meetings enable row level security;

create policy "Users manage client activity meetings on their projects"
  on public.client_activity_meetings for all to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  );

create table public.client_activity_calls (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'completed')),
  start_date date not null,
  start_time text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index client_activity_calls_project_id_idx
  on public.client_activity_calls (project_id);

create trigger set_client_activity_calls_updated_at
  before update on public.client_activity_calls
  for each row
  execute function public.handle_updated_at();

alter table public.client_activity_calls enable row level security;

create policy "Users manage client activity calls on their projects"
  on public.client_activity_calls for all to authenticated
  using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.user_id = auth.uid()
    )
  );
