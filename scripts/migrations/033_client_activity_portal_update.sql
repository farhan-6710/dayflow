-- Migration 033 — Let linked clients delete activities they raised
-- (select/insert/update for client-raised already exist in 026)

drop policy if exists "Clients delete activities they raised" on public.client_activity_tasks;
create policy "Clients delete activities they raised"
  on public.client_activity_tasks for delete to authenticated
  using (
    raised_by = 'client'
    and public.client_portal_can_access_project(project_id)
  );

drop policy if exists "Clients delete meetings they raised" on public.client_activity_meetings;
create policy "Clients delete meetings they raised"
  on public.client_activity_meetings for delete to authenticated
  using (
    raised_by = 'client'
    and public.client_portal_can_access_project(project_id)
  );

drop policy if exists "Clients delete calls they raised" on public.client_activity_calls;
create policy "Clients delete calls they raised"
  on public.client_activity_calls for delete to authenticated
  using (
    raised_by = 'client'
    and public.client_portal_can_access_project(project_id)
  );
