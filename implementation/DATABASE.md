# MovieBox — Database Architecture & Supabase Guide (`DATABASE.md`)

This guide specifies the database schema, Row Level Security (RLS) policies, and environment setup for Supabase cloud persistence in MovieBox.

---

## 1. Supabase PostgreSQL Schema

Execute the following SQL script in your **Supabase Dashboard → SQL Editor**:

```sql
-- 1. Create the favorites table
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  movie_id text not null,
  movie_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, movie_id)
);

-- 2. Create index for fast user library queries
create index if not exists idx_favorites_user_id on public.favorites(user_id);
create index if not exists idx_favorites_movie_id on public.favorites(movie_id);

-- 3. Enable Row Level Security (RLS)
alter table public.favorites enable row level security;

-- 4. RLS Policy: Users can only read their own favorites
create policy "Users can select own favorites"
  on public.favorites
  for select
  using (auth.uid() = user_id);

-- 5. RLS Policy: Users can only insert their own favorites
create policy "Users can insert own favorites"
  on public.favorites
  for insert
  with check (auth.uid() = user_id);

-- 6. RLS Policy: Users can only delete their own favorites
create policy "Users can delete own favorites"
  on public.favorites
  for delete
  using (auth.uid() = user_id);
```

---

## 2. Table Column Reference

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, `gen_random_uuid()` | Unique record identifier |
| `user_id` | `uuid` | Foreign Key to `auth.users(id)`, `on delete cascade` | Owner user ID |
| `movie_id` | `text` | Not Null | ID of the movie (e.g. `'1'`, `'tt1375666'`) |
| `movie_data` | `jsonb` | Not Null | Snapshot of movie attributes (title, posterUrl, rating, etc.) |
| `created_at` | `timestamptz` | Not Null, Default `now()` | Timestamp when favorite was added |

---

## 3. Environment Variable Configuration

Create or update `.env` in the project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Offline & Fallback Handling
- If `.env` is omitted or empty, `src/services/supabase.ts` detects the missing credentials and falls back into **Offline Guest Mode**.
- The app will function completely without crashing:
  - Catalog browsing and searching work locally.
  - Adding/removing favorites works with local `AsyncStorage` persistence.
  - Profile and Favorites tabs display informative offline indicators.
