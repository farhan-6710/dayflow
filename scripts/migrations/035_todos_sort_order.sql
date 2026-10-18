-- Migration 035 — Todos sort_order
-- Persist manual list order (1 = top). Backfill existing rows per user.

alter table public.todos
  add column if not exists sort_order integer not null default 0;

with ranked as (
  select
    id,
    row_number() over (
      partition by user_id
      order by created_at desc, id asc
    ) as rn
  from public.todos
)
update public.todos as t
set sort_order = ranked.rn
from ranked
where t.id = ranked.id;

create index if not exists todos_user_id_status_sort_order_idx
  on public.todos (user_id, status, sort_order);
