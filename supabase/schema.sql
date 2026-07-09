-- AlKarama Ibn Sina Tourisme - database setup
-- Run this once: Supabase Dashboard -> SQL Editor -> New query -> paste all -> Run.
--
-- It creates one table that holds the whole editable site content as a single JSON
-- document, plus security rules: anyone can READ it (so the public site works), only a
-- logged-in admin can CHANGE it.

create table if not exists public.site_content (
  id         text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Visitors (not logged in) can read the content.
drop policy if exists "public read" on public.site_content;
create policy "public read"
  on public.site_content
  for select
  using (true);

-- Only a logged-in admin can insert / update / delete.
drop policy if exists "admin write" on public.site_content;
create policy "admin write"
  on public.site_content
  for all
  to authenticated
  using (true)
  with check (true);

-- Note: the first time the client clicks "Enregistrer" in /admin, the row is created
-- automatically. No need to insert anything here.
--
-- Create the admin login (the client's account):
--   Supabase Dashboard -> Authentication -> Users -> Add user -> enter email + password.
--   (Optionally turn off "Confirm email" under Authentication -> Providers -> Email so the
--    account is active immediately.)
