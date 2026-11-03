-- ============================================================
-- Supabase Storage Bucket Creation
-- These buckets store uploaded images for the application
-- Buckets and policies are idempotent: safe to run more than once
-- ============================================================

-- NOTE: Bucket creation via SQL INSERT into storage.buckets
-- works if the storage schema is accessible. Otherwise, create buckets
-- via the Supabase Dashboard:
--   1. Go to https://supabase.co/dashboard
--   2. Navigate to Storage
--   3. Click "New Bucket" for each bucket below
--   4. Set "Public Bucket: Yes" for all three

-- ============================================================
-- Bucket 1: image_of_day
-- Purpose: Daily featured AI images
-- Public access: Enabled (images are publicly viewable in gallery)
-- ============================================================
-- Method A: Via Supabase Dashboard (recommended)
--   1. Dashboard > Storage > New Bucket
--   2. Name: image_of_day
--   3. Public Bucket: Yes

-- Method B: Via SQL (if storage schema is accessible)
-- This INSERT is idempotent: ON CONFLICT DO NOTHING
INSERT INTO storage.buckets (id, name, public)
VALUES ('image_of_day', 'image_of_day', true)
ON CONFLICT (id) DO NOTHING;

-- Verify bucket creation (run after SQL if accessible):
-- SELECT * FROM storage.buckets WHERE id = 'image_of_day';

-- Objects stored at: image_of_day/<filename>
-- Example: image_of_day/image-of-day-1704067200000-abc123.png

-- ============================================================
-- Bucket 2: prompt_images
-- Purpose: Prompt-related images uploaded with prompts
-- Public access: Enabled (images visible in prompt detail views)
-- ============================================================
-- Method A: Via Supabase Dashboard
--   1. Dashboard > Storage > New Bucket
--   2. Name: prompt_images
--   3. Public Bucket: Yes

-- Method B: Via SQL (if storage schema is accessible)
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt_images', 'prompt_images', true)
ON CONFLICT (id) DO NOTHING;

-- Verify bucket creation (run after SQL if accessible):
-- SELECT * FROM storage.buckets WHERE id = 'prompt_images';

-- Objects stored at: prompt_images/<filename>
-- Example: prompt_images/prompt-image-1704067200000-abc123.png

-- ============================================================
-- Bucket 3: community-prompt-images
-- Purpose: Community prompt images / avatar images
-- Public access: Enabled (images visible in community views)
-- ============================================================
-- Method A: Via Supabase Dashboard
--   1. Dashboard > Storage > New Bucket
--   2. Name: community-prompt-images
--   3. Public Bucket: Yes

-- Method B: Via SQL (if storage schema is accessible)
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-prompt-images', 'community-prompt-images', true)
ON CONFLICT (id) DO NOTHING;

-- Verify bucket creation (run after SQL if accessible):
-- SELECT * FROM storage.buckets WHERE id = 'community-prompt-images';

-- Objects stored at: community-prompt-images/<filename>
-- Example: community-prompt-images/avatar-1704067200000-abc123.png

-- ============================================================
-- Post-bucket creation: Storage object policies
-- These policies control access to objects within buckets.
-- Policies are made idempotent using DROP IF EXISTS pattern.
-- ============================================================

-- ============================================================
-- image_of_day bucket policies
-- ============================================================
-- Allow public to read/download objects (gallery view)
-- Idempotent: drop before create in setup scripts
DROP POLICY IF EXISTS "Public can read image_of_day objects" ON storage.objects;
CREATE POLICY "Public can read image_of_day objects" ON storage.objects
    FOR SELECT USING (bucket_id = 'image_of_day');

-- REMOVED: Service role FOR ALL policy.
-- The service_role key bypasses RLS entirely; adding FOR ALL policies
-- is redundant and conflates RLS behavior. Documented for awareness only.
-- If truly needed for object-level permission tracking, create via
-- Dashboard > Storage > Bucket > Add lifecycle rule / IAM integration.

-- ============================================================
-- prompt_images bucket policies
-- ============================================================
DROP POLICY IF EXISTS "Public can read prompt_images objects" ON storage.objects;
CREATE POLICY "Public can read prompt_images objects" ON storage.objects
    FOR SELECT USING (bucket_id = 'prompt_images');

-- REMOVED: Service role FOR ALL policy.
-- Same rationale as image_of_day bucket.

-- ============================================================
-- community-prompt-images bucket policies
-- ============================================================
DROP POLICY IF EXISTS "Public can read community-prompt-images objects" ON storage.objects;
CREATE POLICY "Public can read community-prompt-images objects" ON storage.objects
    FOR SELECT USING (bucket_id = 'community-prompt-images');

-- REMOVED: Service role FOR ALL policy.
-- Same rationale as image_of_day bucket.

-- ============================================================
-- Policy Summary
-- ============================================================
-- Bucket           | Public Read | Public Write | Service Role
-- -----------------+-------------+--------------+--------------
-- image_of_day     | ✅ SELECT   | ❌ N/A        | Bypasses RLS (no policy needed)
-- prompt_images    | ✅ SELECT   | ❌ N/A        | Bypasses RLS (no policy needed)
-- community-prompt-images | ✅ SELECT | ❌ N/A | Bypasses RLS (no policy needed)
--
-- Important: There are NO anonymous WRITE policies (INSERT/UPDATE/DELETE)
-- on any bucket. Uploads must be performed through trusted Netlify Functions
-- using the supabaseAdmin client with the service role key.
-- Frontend code must NOT directly upload to Supabase Storage.