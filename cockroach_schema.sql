-- PromptHub CockroachDB Schema
-- Run this once to initialize the database

-- Enable UUID extension (CockroachDB has gen_random_uuid() built-in)

-- ============================================================
-- PROMPTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS prompts (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug        TEXT UNIQUE NOT NULL,
    title       TEXT,
    like_count  INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LIKES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS likes (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prompt_slug TEXT NOT NULL REFERENCES prompts(slug) ON DELETE CASCADE,
    user_key    TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (prompt_slug, user_key)
);

CREATE INDEX IF NOT EXISTS idx_likes_prompt_slug ON likes(prompt_slug);
CREATE INDEX IF NOT EXISTS idx_likes_user_key    ON likes(user_key);

-- ============================================================
-- IMAGE_OF_DAY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS image_of_day (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_url   TEXT NOT NULL,
    prompt      TEXT NOT NULL,
    likes       INT DEFAULT 0,
    is_active   BOOL DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_image_of_day_created_at ON image_of_day(created_at DESC);

-- ============================================================
-- PROMPTS_SHARED TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS prompts_shared (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    tags        TEXT[] DEFAULT ARRAY[]::TEXT[],
    model       TEXT NOT NULL,
    like_count  INT DEFAULT 0,
    is_approved BOOL DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prompts_shared_created_at ON prompts_shared(created_at DESC);
