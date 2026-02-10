-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROMPTS TABLE
create table if not exists prompts (
    id uuid default uuid_generate_v4() primary key,
    slug text unique not null,
    title text,
    like_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- LIKES TABLE
create table if not exists likes (
    id uuid default uuid_generate_v4() primary key,
    prompt_slug text not null references prompts(slug) on delete cascade,
    user_key text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    unique(prompt_slug, user_key)
);

-- RLS POLICIES (Public access for this simple app)
alter table prompts enable row level security;
alter table likes enable row level security;

-- Allow anonymous read access
create policy "Allow public read access on prompts"
on prompts for select using (true);

create policy "Allow public read access on likes"
on likes for select using (true);

-- Allow anonymous insert/update for likes system
-- NOTE: In a real production app with auth, you'd restrict this to authenticated users
create policy "Allow public insert on prompts"
on prompts for insert with check (true);

create policy "Allow public update on prompts"
on prompts for update using (true);

create policy "Allow public insert on likes"
on likes for insert with check (true);

create policy "Allow public delete on likes"
on likes for delete using (true);


-- RPC Functions for atomic increments/decrements
create or replace function increment_like_count(row_slug text)
returns void as $$
begin
  update prompts
  set like_count = like_count + 1
  where slug = row_slug;
end;
$$ language plpgsql;

create or replace function decrement_like_count(row_slug text)
returns void as $$
begin
  update prompts
  set like_count = greatest(0, like_count - 1)
  where slug = row_slug;
end;
$$ language plpgsql;
