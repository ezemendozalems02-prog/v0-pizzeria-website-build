-- Create media bucket in Supabase Storage if it doesn't exist
-- This bucket will store all images, banners, and product photos

-- Note: Supabase Storage buckets are managed via the dashboard or REST API
-- This SQL script is informational. To create the bucket, use:
-- 
-- 1. Supabase Dashboard: Storage > Create a new bucket > "media" > Public
-- 2. Or use the REST API:
--    POST https://[YOUR-PROJECT].supabase.co/storage/v1/bucket
--    Headers: Authorization: Bearer [SERVICE_ROLE_KEY]
--    Body: { "name": "media", "public": true }

-- After the bucket is created, RLS policies below will allow:
-- - Anyone can view/download images (SELECT on bucket)
-- - Only authenticated admins can upload/update (INSERT/UPDATE)
-- - Only authenticated admins can delete (DELETE)

-- The bucket should be PUBLIC so image URLs are accessible without auth

-- Example public URL format:
-- https://[YOUR-PROJECT].supabase.co/storage/v1/object/public/media/banners/file.jpg
-- https://[YOUR-PROJECT].supabase.co/storage/v1/object/public/media/products/file.jpg
