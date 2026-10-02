-- Migration 030 — Note category for project notes listing filters

alter table public.notes
  add column if not exists category text not null default 'general';

alter table public.notes
  drop constraint if exists notes_category_check;

alter table public.notes
  add constraint notes_category_check
    check (category in ('general', 'meeting', 'research', 'decision', 'reference'));
