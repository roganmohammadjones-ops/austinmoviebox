# Austin MovieBox — Data Model & Schema Specification (`data-model.md`)

> **Document**: Domain Entities, TypeScript Contracts, Local Storage & Cloud Database Schema  
> **Application**: Austin MovieBox (MovieBox MVP)  
> **Version**: 1.0.0  
> **Status**: Approved & Specified  

---

## 1. Domain Entities & TypeScript Contracts

All data structures are standardized across the client application, local storage, and remote Supabase services.

### 1.1 Movie Entity
The primary domain model representing a cinema release:

```typescript
// src/types/index.ts

export interface Movie {
  /** Unique string identifier (e.g. '1', 'tt1375666') */
  id: string;
  
  /** Official theatrical release title */
  title: string;
  
  /** Full storyline synopsis */
  overview: string;
  
  /** Full URL to portrait poster image (2:3 aspect ratio) */
  posterUrl: string;
  
  /** Full URL to landscape backdrop banner image (16:9 aspect ratio) */
  backdropUrl: string;
  
  /** Rating score from 0.0 to 10.0 (e.g. 8.6) */
  rating: number;
  
  /** 4-digit theatrical release year (e.g. 2024) */
  releaseYear: number;
  
  /** Array of genre tags (e.g. ['Sci-Fi', 'Adventure']) */
  genres: string[];
  
  /** Total runtime in minutes (e.g. 166) */
  durationMinutes: number;
  
  /** Lead director name (optional) */
  director?: string;
  
  /** Top-billed cast member names (optional) */
  cast?: string[];
}
```

### 1.2 User Profile & Session Types
Represents the authenticated user identity:

```typescript
export interface UserProfile {
  /** Supabase auth user UUID */
  id: string;
  
  /** Registered email address */
  email: string;
  
  /** ISO 8601 registration timestamp */
  createdAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isGuest: boolean;
  isLoading: boolean;
}
```

### 1.3 Genre Taxonomy
Supported categories for filtering:

```typescript
export type Genre = 
  | 'All'
  | 'Action'
  | 'Adventure'
  | 'Animation'
  | 'Comedy'
  | 'Crime'
  | 'Drama'
  | 'Horror'
  | 'Sci-Fi'
  | 'Thriller';
```

---

## 2. Client Local Storage Schema (`AsyncStorage`)

Local data persistence is powered by `@react-native-async-storage/async-storage` wrapped in reactive Zustand stores.

| Storage Key | Data Type | Serialized Format | Purpose |
| :--- | :--- | :--- | :--- |
| `@moviebox_onboarding` | `boolean` | `"true"` or `"false"` | Tracks whether the user has completed or skipped the onboarding carousel. |
| `@moviebox_favorites` | `Movie[]` | JSON stringified array of `Movie` objects | Local-first store for guest and cached user favorites. |
| `@moviebox_auth` | `Session` | Supabase GoTrue serialized JSON session | Persists active auth tokens (access token, refresh token) across app launches. |

### Example Serialized `@moviebox_favorites` Payload:
```json
[
  {
    "id": "1",
    "title": "Dune: Part Two",
    "overview": "Paul Atreides unites with Chani and the Fremen while seeking revenge...",
    "posterUrl": "https://images.unsplash.com/photo-1534447677768-be436bb09401",
    "backdropUrl": "https://images.unsplash.com/photo-1440404653325-ab127d49abc1",
    "rating": 8.6,
    "releaseYear": 2024,
    "genres": ["Sci-Fi", "Adventure"],
    "durationMinutes": 166,
    "director": "Denis Villeneuve",
    "cast": ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"]
  }
]
```

---

## 3. Supabase Cloud Database Schema (PostgreSQL)

When users create an account or sign in, favorites are synchronized to Supabase PostgreSQL.

### 3.1 SQL Table Definition: `public.favorites`

```sql
-- 1. Create public.favorites table
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  movie_id text not null,
  movie_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, movie_id)
);

-- 2. Create high-performance query indexes
create index if not exists idx_favorites_user_id on public.favorites(user_id);
create index if not exists idx_favorites_movie_id on public.favorites(movie_id);

-- 3. Enable Row Level Security (RLS)
alter table public.favorites enable row level security;

-- 4. RLS Policy: Select scoped to owner
create policy "Users can select own favorites"
  on public.favorites
  for select
  using (auth.uid() = user_id);

-- 5. RLS Policy: Insert scoped to owner
create policy "Users can insert own favorites"
  on public.favorites
  for insert
  with check (auth.uid() = user_id);

-- 6. RLS Policy: Delete scoped to owner
create policy "Users can delete own favorites"
  on public.favorites
  for delete
  using (auth.uid() = user_id);
```

### 3.2 Column Catalog & Constraints

| Column Name | Postgres Type | Nullable | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `uuid` | No | `gen_random_uuid()` | Surrogate primary key. |
| `user_id` | `uuid` | No | None | Foreign key linking to `auth.users(id)`. Deletion cascades. |
| `movie_id` | `text` | No | None | External unique movie identifier (e.g. `'1'`). |
| `movie_data` | `jsonb` | No | None | Complete serialized `Movie` object for offline-ready reads. |
| `created_at` | `timestamptz` | No | `now()` | Timestamp when the movie was added to favorites. |

---

## 4. Synchronization Contracts & Deduplication Logic

### 4.1 Union Merge Equation
When a guest with local bookmarks signs in:

$$\text{Final Watchlist} = \text{LocalFavorites} \cup \text{RemoteFavorites}$$

Deduplication is strictly performed using `movie.id === remoteRecord.movie_id`.

### 4.2 Batch Synchronization Algorithm
1. **Fetch Remote**: Query Supabase for all records belonging to `auth.uid()`.
2. **Compute Delta**:
   ```typescript
   const remoteMovieIds = new Set(remoteRecords.map(r => r.movie_id));
   const localOnlyMovies = localFavorites.filter(m => !remoteMovieIds.has(m.id));
   ```
3. **Batch Insert**: If `localOnlyMovies.length > 0`, insert them into `public.favorites`:
   ```typescript
   const payload = localOnlyMovies.map(movie => ({
     user_id: userId,
     movie_id: movie.id,
     movie_data: movie,
   }));
   await supabase.from('favorites').upsert(payload, { onConflict: 'user_id,movie_id' });
   ```
4. **Hydrate Cache**: Update local Zustand store and AsyncStorage with the union set.
