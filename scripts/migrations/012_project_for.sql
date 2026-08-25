-- Migration 012 — Project for (Myself or a client)

alter table public.projects
  add column project_for uuid references public.clients (id) on delete set null;

create index projects_project_for_idx on public.projects (project_for);
