-- Migration 038 — Drop profiles.theme_preference
-- The theme now follows the device by default and is remembered in the browser, so it is no
-- longer stored per user. handle_new_user() inserts that column, so it is redefined first;
-- dropping the column alone would make every new sign-up fail.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

alter table public.profiles
  drop column if exists theme_preference;
