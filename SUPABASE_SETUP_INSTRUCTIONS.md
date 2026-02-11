# Supabase Setup Instructions

## Problem: Like Count Not Persisting

If you're experiencing issues with like counts resetting to 0 after page refresh, it's because the database Row Level Security (RLS) policies are blocking updates.

## Solution

You need to update your Supabase database schema with the corrected RLS policies. There are two ways to do this:

### Option 1: Run SQL in Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL commands:

```sql
-- Drop the policy if it exists (safe to run even if it doesn't exist)
DROP POLICY IF EXISTS "Allow public update of like_count" ON prompts_shared;

-- Create UPDATE policy for like_count
CREATE POLICY "Allow public update of like_count"
ON prompts_shared FOR UPDATE
USING (is_approved = true)
WITH CHECK (is_approved = true);

-- Update RPC function to use SECURITY DEFINER
CREATE OR REPLACE FUNCTION increment_shared_prompt_like(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE prompts_shared
  SET like_count = like_count + 1
  WHERE id = row_id AND is_approved = true;
END;
$$;
```

### Option 2: Re-run Full Schema

If you haven't customized your database beyond the initial setup:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase_community_schema.sql`
4. Paste and execute in the SQL Editor

## Verification

After running the SQL:

1. Go to http://localhost:5173/community
2. Click the like button on any prompt
3. Refresh the page
4. The like count should persist!

## Technical Details

The issue was that:
- RLS (Row Level Security) was enabled on the `prompts_shared` table
- There was a SELECT policy and an INSERT policy
- **There was NO UPDATE policy** - this blocked all updates, including the RPC function
- The RPC function lacked `SECURITY DEFINER` which allows it to bypass RLS

The fix adds:
- An UPDATE policy that allows public updates when `is_approved = true`
- `SECURITY DEFINER` to the RPC function so it can execute with elevated privileges
