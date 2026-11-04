-- Migration 039 — Allow notes.category to be unset (null)
-- Owner applies this; agents never run migrations against the live database.

alter table public.notes
  alter column category drop not null;

alter table public.notes
  alter column category drop default;

alter table public.notes
  drop constraint if exists notes_category_check;

alter table public.notes
  add constraint notes_category_check
    check (category is null or category in ('general', 'meeting', 'research', 'decision', 'reference'));
