-- Delete November 2026 tasks for the demo account only.
-- Paste into Supabase → SQL Editor → Run.

delete from public.tasks t
using auth.users u
where t.user_id = u.id
  and u.email = 'dayflow.demo@gmail.com'
  and t.due_date >= date '2026-11-01'
  and t.due_date <  date '2026-12-01';
