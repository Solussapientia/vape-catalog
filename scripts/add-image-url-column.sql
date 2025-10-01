-- Adds image_url column to products for app-provided full URLs
-- Run this in Supabase SQL editor once

alter table if exists public.products
  add column if not exists image_url text;

-- Optional: backfill example
-- update public.products set image_url = NULL where image_url is null;


