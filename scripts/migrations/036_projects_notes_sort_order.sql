-- Migration 036 — Projects & notes sort_order
-- Persist manual list order (1 = top) for projects and project notes.

alter table public.projects
  add column if not exists sort_order integer not null default 0;

with ranked_projects as (
  select
    id,
    row_number() over (
      partition by user_id
      order by created_at desc, id asc
    ) as rn
  from public.projects
)
update public.projects as p
set sort_order = ranked_projects.rn
from ranked_projects
where p.id = ranked_projects.id;

create index if not exists projects_user_id_sort_order_idx
  on public.projects (user_id, sort_order);

alter table public.notes
  add column if not exists sort_order integer not null default 0;

with ranked_notes as (
  select
    id,
    row_number() over (
      partition by coalesce(project_id::text, user_id::text)
      order by updated_at desc, id asc
    ) as rn
  from public.notes
)
update public.notes as n
set sort_order = ranked_notes.rn
from ranked_notes
where n.id = ranked_notes.id;

create index if not exists notes_project_id_sort_order_idx
  on public.notes (project_id, sort_order);
