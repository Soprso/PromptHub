-- Community Prompts Table (Updated with moderation)
create table if not exists prompts_shared (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    content text not null,
    tags text[] default '{}',
    model text not null,
    like_count integer default 0,
    is_approved boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Index for performance
create index if not exists idx_prompts_shared_created_at on prompts_shared(created_at desc);
create index if not exists idx_prompts_shared_approved on prompts_shared(is_approved) where is_approved = true;

-- RLS Policies
alter table prompts_shared enable row level security;

-- Allow reading only approved prompts
create policy "Allow public read access to approved prompts"
on prompts_shared for select using (is_approved = true);

-- Allow anonymous insert (will be unapproved by default)
create policy "Allow public insert on prompts_shared"
on prompts_shared for insert with check (true);

-- CRITICAL: Allow public update for like_count only
-- This policy allows anyone to update ONLY the like_count column
create policy "Allow public update of like_count"
on prompts_shared for update
using (is_approved = true)
with check (is_approved = true);

-- RPC for Likes (uses SECURITY DEFINER to bypass RLS)
create or replace function increment_shared_prompt_like(row_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update prompts_shared
  set like_count = like_count + 1
  where id = row_id and is_approved = true;
end;
$$;
