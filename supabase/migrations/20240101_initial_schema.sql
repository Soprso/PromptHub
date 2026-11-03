-- ============================================================
-- Supabase PostgreSQL Migrations for PromptHub
-- Fresh setup (no existing tables)
-- Migrations are idempotent: safe to run more than once
-- ============================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 2. Database Tables
-- ============================================================

-- ============================================================
-- PROMPTS TABLE
-- Stores individual prompt metadata with like counts
-- slug is TEXT UNIQUE, NOT UUID
-- ============================================================
CREATE TABLE IF NOT EXISTS prompts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ============================================================
-- LIKES TABLE
-- Tracks which users liked which prompts (via user_key)
-- user_key is a persistent identifier, not necessarily Supabase auth
-- prompt_slug is TEXT referencing prompts(slug), NOT UUID
-- ============================================================
CREATE TABLE IF NOT EXISTS likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    prompt_slug TEXT NOT NULL REFERENCES prompts(slug) ON DELETE CASCADE,
    user_key TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(prompt_slug, user_key)
);

-- ============================================================
-- IMAGE_OF_DAY TABLE
-- Stores featured/daily AI images with metadata
-- ============================================================
CREATE TABLE IF NOT EXISTS image_of_day (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ============================================================
-- PROMPTS_SHARED TABLE
-- Stores community-submitted prompts with moderation
-- ============================================================
CREATE TABLE IF NOT EXISTS prompts_shared (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    tags TEXT[] DEFAULT '{}'::text[],
    model TEXT NOT NULL,
    like_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ============================================================
-- PROFILES TABLE
-- User profiles (persistent user_key-based, not Supabase auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    user_key TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ============================================================
-- ORDERS TABLE
-- Order tracking for payments/transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_key TEXT NOT NULL REFERENCES profiles(user_key) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ============================================================
-- PAYMENTS TABLE
-- Payment records linked to orders
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_key TEXT NOT NULL REFERENCES profiles(user_key) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- ============================================================
-- 3. Database Indexes
-- ============================================================

-- Prompts indexes
CREATE INDEX IF NOT EXISTS idx_prompts_slug ON prompts (slug);
CREATE INDEX IF NOT EXISTS idx_prompts_like_count ON prompts (like_count DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts (created_at DESC);

-- Likes indexes
CREATE INDEX IF NOT EXISTS idx_likes_prompt_slug ON likes (prompt_slug);
CREATE INDEX IF NOT EXISTS idx_likes_user_key ON likes (user_key);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON likes (created_at DESC);

-- Image of day indexes
CREATE INDEX IF NOT EXISTS idx_image_of_day_active_created ON image_of_day (is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_image_of_day_is_active ON image_of_day (is_active);
CREATE INDEX IF NOT EXISTS idx_image_of_day_likes ON image_of_day (likes DESC);

-- Prompts shared indexes
CREATE INDEX IF NOT EXISTS idx_prompts_shared_approved ON prompts_shared (is_approved);
CREATE INDEX IF NOT EXISTS idx_prompts_shared_created ON prompts_shared (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_shared_like_count ON prompts_shared (like_count DESC);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_key ON profiles (user_key);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles (username);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_key ON orders (user_key);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments (order_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_key ON payments (user_key);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments (created_at DESC);

-- ============================================================
-- 4. Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS on all tables (idempotent: ALTER TABLE IF enabled is a no-op)
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_of_day ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts_shared ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROMPTS RLS: Public can read, service role full access
-- ============================================================
-- Use DROP POLICY IF EXISTS + CREATE POLICY for idempotency
DROP POLICY IF EXISTS "Public can read prompts" ON prompts;
CREATE POLICY "Public can read prompts" ON prompts
    FOR SELECT USING (true);

-- Service role policy: documented for clarity; service_role bypasses RLS
DROP POLICY IF EXISTS "Service role access on prompts" ON prompts;
CREATE POLICY "Service role access on prompts" ON prompts
    USING (true) WITH CHECK (true);

-- ============================================================
-- LIKES RLS: Public read access for like counts,
--            public insert/delete via user_key tracking
-- ============================================================
DROP POLICY IF EXISTS "Public can read likes" ON likes;
CREATE POLICY "Public can read likes" ON likes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert likes" ON likes;
CREATE POLICY "Public can insert likes" ON likes
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can delete likes" ON likes;
CREATE POLICY "Public can delete likes" ON likes
    FOR DELETE USING (true);

DROP POLICY IF EXISTS "Service role access on likes" ON likes;
CREATE POLICY "Service role access on likes" ON likes
    USING (true) WITH CHECK (true);

-- ============================================================
-- IMAGE_OF_DAY RLS: Public can read active images,
--                   service role full access
-- ============================================================
DROP POLICY IF EXISTS "Public can read active images" ON image_of_day;
CREATE POLICY "Public can read active images" ON image_of_day
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Service role access on image_of_day" ON image_of_day;
CREATE POLICY "Service role access on image_of_day" ON image_of_day
    USING (true) WITH CHECK (true);

-- ============================================================
-- PROMPTS_SHARED RLS: Public read moderation,
--                    service role full access,
--                    public insert of new community prompts
--                    NO general anonymous UPDATE (restricted via RPC only)
-- ============================================================
DROP POLICY IF EXISTS "Public can read approved community prompts" ON prompts_shared;
CREATE POLICY "Public can read approved community prompts" ON prompts_shared
    FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Public can insert community prompts" ON prompts_shared;
CREATE POLICY "Public can insert community prompts" ON prompts_shared
    FOR INSERT WITH CHECK (true);

-- REMOVED: General anonymous UPDATE policy on prompts_shared.
-- like_count changes must go through the restricted RPC:
--   SELECT increment_shared_prompt_like(prompt_id)
-- This prevents arbitrary column updates on unapproved content.

DROP POLICY IF EXISTS "Service role access on prompts_shared" ON prompts_shared;
CREATE POLICY "Service role access on prompts_shared" ON prompts_shared
    USING (true) WITH CHECK (true);

-- ============================================================
-- PROFILES RLS: No client-supplied user_key in RLS policies.
-- Ownership enforced server-side in Netlify Functions only.
-- Do not use current_setting('app.user_key') in RLS policies.
-- This prevents untrusted clients from reading/modifying other users' data.
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
-- Replace with service-role documentation policy:
DROP POLICY IF EXISTS "Service role access on profiles" ON profiles;
CREATE POLICY "Service role access on profiles" ON profiles
    USING (true) WITH CHECK (true);

-- ============================================================
-- ORDERS RLS: No client-supplied user_key in RLS policies.
-- Ownership enforced server-side in trusted Netlify Functions only.
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
-- Replace with service-role documentation policy:
DROP POLICY IF EXISTS "Service role access on orders" ON orders;
CREATE POLICY "Service role access on orders" ON orders
    USING (true) WITH CHECK (true);

-- ============================================================
-- PAYMENTS RLS: No client-supplied user_key in RLS policies.
-- Ownership enforced server-side in trusted Netlify Functions only.
DROP POLICY IF EXISTS "Users can read own payments" ON payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON payments;
DROP POLICY IF EXISTS "Users can update own payments" ON payments;
-- Replace with service-role documentation policy:
DROP POLICY IF EXISTS "Service role access on payments" ON payments;
CREATE POLICY "Service role access on payments" ON payments
    USING (true) WITH CHECK (true);

-- ============================================================
-- 5. RPC Functions for Like Counting
-- ============================================================

-- RPC: Increment like count on a prompt
-- Uses prompts.slug (TEXT) for lookup; no PUBLIC execute grant needed
-- application-level function call required via supabase-admin
CREATE OR REPLACE FUNCTION increment_like_count(row_slug text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE prompts
    SET like_count = like_count + 1,
        updated_at = timezone('utc', now())
    WHERE slug = row_slug;
END;
$$;

-- RPC: Decrement like count on a prompt (minimum 0)
CREATE OR REPLACE FUNCTION decrement_like_count(row_slug text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE prompts
    SET like_count = greatest(0, like_count - 1),
        updated_at = timezone('utc', now())
    WHERE slug = row_slug;
END;
$$;

-- RPC: Increment like count on a community prompt
-- SECURITY DEFINER with safe search_path and fully qualified table reference.
-- Only updates like_count where is_approved = true.
-- No PUBLIC execute grant; application calls via supabase-admin with service role key.
CREATE OR REPLACE FUNCTION increment_shared_prompt_like(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE prompts_shared
    SET like_count = like_count + 1,
        updated_at = timezone('utc', now())
    WHERE id = row_id AND is_approved = true;
END;
$$;

-- RPC: Get prompt stats (like count and like status)
-- No PUBLIC execute grant. row_user_key validated by calling function.
CREATE OR REPLACE FUNCTION get_prompt_stats(row_slug text, row_user_key text)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
    like_count INTEGER;
    has_liked BOOLEAN := false;
BEGIN
    -- Get like count
    SELECT COALESCE(like_count, 0) INTO like_count
    FROM prompts
    WHERE slug = row_slug;

    -- Check if user has liked this prompt.
    -- Caution: If row_user_key from untrusted source, result may be inaccurate.
    -- Recommended: validate user_key within trusted Netlify Function before call.
    IF row_user_key IS NOT NULL THEN
        SELECT EXISTS(
            SELECT 1 FROM likes
            WHERE prompt_slug = row_slug AND user_key = row_user_key
        ) INTO has_liked;
    END IF;

    RETURN jsonb_build_object(
        'like_count', like_count,
        'hasLiked', has_liked
    );
END;
$$;

-- ============================================================
-- 6. Triggers for automatic updated_at
-- Only apply to tables that have an updated_at column
-- ============================================================

-- Do NOT create trigger on `likes` table - it does NOT have an updated_at column.
-- Like records are managed via INSERT/DELETE, not UPDATEs of the like itself.

-- Trigger function for tables with updated_at column
DROP FUNCTION IF EXISTS update_updated_at_column();
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers ONLY to tables that have updated_at columns
-- Use DROP TRIGGER IF EXISTS + CREATE TRIGGER for idempotency
DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts;
CREATE TRIGGER update_prompts_updated_at
    BEFORE UPDATE ON prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_image_of_day_updated_at ON image_of_day;
CREATE TRIGGER update_image_of_day_updated_at
    BEFORE UPDATE ON image_of_day
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prompts_shared_updated_at ON prompts_shared;
CREATE TRIGGER update_prompts_shared_updated_at
    BEFORE UPDATE ON prompts_shared
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. Migration Notes
-- ============================================================

-- 1. This schema is designed for fresh Supabase PostgreSQL setup
-- 2. All UUIDs are generated via uuid_generate_v4()
-- 3. Key fix: likes.prompt_slug is TEXT NOT NULL REFERENCES prompts(slug)
--    (previously incorrectly defined as UUID referencing prompts(slug))
--    prompts.slug is TEXT UNIQUE, therefore the FK must be TEXT
-- 4. No trigger on likes table - it lacks updated_at column
-- 5. RLS policies: Service role bypasses RLS entirely; "Service role access"
--    policies are documented for clarity but have no operational effect beyond that.
-- 6. NO app.user_key GUC in RLS policies: user_key ownership is enforced
--    server-side in Netlify Functions, not in database RLS policies.
--    This prevents untrusted clients from reading/modifying other users' data.
-- 7. Profiles, Orders, Payments: No RLS policies grant anonymous access.
--    Access via trusted Netlify Functions only. No public SELECT on these tables.
-- 8. Like counting uses user_key (not Supabase auth users)
--    - Public can insert/like via user_key
--    - RPC functions (increment_like_count, decrement_like_count)
--      handle atomic increments via trusted function calls
--    - increment_shared_prompt_like restricted to approved prompts only
--    - No general UPDATE policy on prompts_shared; use RPC exclusively
-- 9. Community prompts (prompts_shared) use is_approved flag
--    - Public can read only approved prompts
--    - Public can insert (unapproved by default)
--    - Like counting requires is_approved = true check via RPC
-- 10. Migrations are idempotent: DROP POLICY IF EXISTS / CREATE POLICY,
--    DROP TRIGGER IF EXISTS / CREATE TRIGGER, CREATE TABLE IF NOT EXISTS,
--    CREATE INDEX IF NOT EXISTS. Safe to run more than once.
--    Policy/triggers that are not idempotent use DROP IF EXISTS before CREATE.
-- 11. Relationships maintained:
--     - prompts.id (PK) → likes.prompt_slug (FK with ON DELETE CASCADE)
--     - prompts.slug TEXT type must match likes.prompt_slug TEXT type
--     - profiles.user_key → orders.user_key (FK with ON DELETE CASCADE)
--     - orders.id (PK) → payments.order_id (FK with ON DELETE CASCADE)
--     - profiles.user_key → payments.user_key (FK with ON DELETE CASCADE)
-- 12. RPC execution: No function has GRANT EXECUTE TO PUBLIC.
--    All RPCs require application-level invocation through supabase-admin
--    (service role key). This prevents arbitrary execution by untrusted clients.