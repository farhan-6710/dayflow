-- Migration 007 — Drop plans (tasks no longer grouped by project milestones)

drop table if exists public.plans cascade;
