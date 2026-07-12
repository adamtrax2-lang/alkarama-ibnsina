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


-- ---------------------------------------------------------------------------
-- PHOTO UPLOAD (Supabase Storage)
-- ---------------------------------------------------------------------------
-- Lets the client upload photos from /admin (hotels, packs, hero, destinations)
-- instead of typing a file path. Images are compressed in the browser first, then
-- uploaded here and served from a public URL.
--
-- Step 1 (one click, easiest): Dashboard -> Storage -> New bucket
--   Name: site-images
--   Public bucket: ON (toggle it on)
--   Create.
--
-- Step 2: run the SQL below (SQL Editor) so the logged-in admin can upload/replace/
-- delete files in that bucket. Public read is already granted by the "Public bucket"
-- toggle above, so visitors can see the photos.
--
-- (If you prefer SQL-only and skipped the dashboard bucket, uncomment the insert.)
-- insert into storage.buckets (id, name, public)
--   values ('site-images', 'site-images', true)
--   on conflict (id) do update set public = true;

drop policy if exists "admin upload images" on storage.objects;
create policy "admin upload images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'site-images');

drop policy if exists "admin update images" on storage.objects;
create policy "admin update images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');

drop policy if exists "admin delete images" on storage.objects;
create policy "admin delete images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'site-images');

-- Public read of the photos (visitors). Only needed if the bucket is NOT marked public
-- in the dashboard; harmless to keep either way.
drop policy if exists "public read images" on storage.objects;
create policy "public read images"
  on storage.objects
  for select
  using (bucket_id = 'site-images');
