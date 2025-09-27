-- Enable public inserts/updates for adding brands and flavors from the UI
-- Run this once in Supabase SQL Editor if writes fail from the app.

-- PRODUCTS: allow anon insert/update
drop policy if exists "Allow public insert on products" on products;
create policy "Allow public insert on products" on products
  for insert
  to anon
  with check (true);

drop policy if exists "Allow public update on products" on products;
create policy "Allow public update on products" on products
  for update
  to anon
  using (true)
  with check (true);

-- FLAVORS: allow anon insert (and optionally update)
drop policy if exists "Allow public insert on flavors" on flavors;
create policy "Allow public insert on flavors" on flavors
  for insert
  to anon
  with check (true);

-- Optional: allow anon update to toggle stock if desired
-- drop policy if exists "Allow public update on flavors" on flavors;
-- create policy "Allow public update on flavors" on flavors
--   for update
--   to anon
--   using (true)
--   with check (true);

-- STORAGE BUCKET NOTE:
-- Some Supabase instances do not expose storage.create_bucket() via SQL.
-- If the block above fails, create the bucket via Dashboard:
-- Storage -> Create new bucket -> Name: public -> Public: enabled.

-- STORAGE policies for anon read + upload to 'public' bucket
drop policy if exists "Public Read" on storage.objects;
create policy "Public Read" on storage.objects
  for select to anon
  using (bucket_id = 'public');

drop policy if exists "Public Upload" on storage.objects;
create policy "Public Upload" on storage.objects
  for insert to anon
  with check (bucket_id = 'public');


