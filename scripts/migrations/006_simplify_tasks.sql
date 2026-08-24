-- Migration 006 — Simplify tasks (standalone, no project/plan links)

alter table public.tasks drop constraint if exists tasks_project_id_fkey;
alter table public.tasks drop constraint if exists tasks_plan_id_fkey;

drop index if exists tasks_project_id_idx;
drop index if exists tasks_plan_id_idx;

alter table public.tasks
  drop column if exists project_id,
  drop column if exists plan_id,
  drop column if exists reminder_at;
