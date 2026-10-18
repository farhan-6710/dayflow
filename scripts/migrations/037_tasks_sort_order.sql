-- Migration 037 — Tasks sort_order
-- Manual order within each due_date (1 = top of that day's list).

alter table public.tasks
  add column if not exists sort_order integer not null default 0;

with ranked as (
  select
    id,
    row_number() over (
      partition by user_id, coalesce(due_date::text, '')
      order by created_at desc, id asc
    ) as rn
  from public.tasks
)
update public.tasks as t
set sort_order = ranked.rn
from ranked
where t.id = ranked.id;

create index if not exists tasks_user_due_sort_idx
  on public.tasks (user_id, due_date, sort_order);
