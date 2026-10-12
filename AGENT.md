# Austin MovieBox — AI Agent Operating Guide (`AGENT.md`)

> **Master Agent Instruction & Repository Directive**  
> **Target Project**: AustinMovieBox (MovieBox MVP)  
> **Source Documents**: [BLUEPRINT.md](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md) | [DESIGN.md](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md)  
> **Tech Stack**: Expo SDK 57 (React Native 0.86), Expo Router, Zustand 5, AsyncStorage, Supabase JS, NativeWind v4 / Tailwind CSS

---

## 1. THE DOCUMENTS RULE (MANDATORY ENFORCEMENT)

All AI agents, coding assistants, and subagents operating in this repository **MUST STRICTLY ENFORCE AND ADHERE TO THE DOCUMENTS RULE**.

### The Rule Defined
1. **Single Source of Truth**:  
   [BLUEPRINT.md](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md) and [DESIGN.md](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md) constitute the absolute product, architectural, and visual specification for MovieBox.  
   No code, schema, store, route, design token, or interaction may be implemented that contradicts or diverges from these documents.
2. **Zero Hallucination / Scope Integrity**:  
   Under no circumstances should features outside the MVP scope be introduced (e.g., video streaming players, payment rails, direct messaging, user reviews, social feeds, or TV casting). See [Section 2 of BLUEPRINT.md](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md#L50-L56) and [Section 5 of DESIGN.md](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md#L126-L145).
3. **Bounded-Task Iteration Protocol (DESIGN.md §64)**:  
   Agents must **never** attempt to implement the entire application in a single blind code generation pass. Development must strictly proceed through bounded, verifiable steps:
   $$\text{Understand} \to \text{Specify} \to \text{Design} \to \text{Plan Data/Architecture} \to \text{Implement Bounded Task} \to \text{Run App} \to \text{Test Acceptance Criteria} \to \text{Compare Design} \to \text{Correct Differences} \to \text{Update Documentation} \to \text{Commit Changes} \to \text{Next Bounded Task}$$
4. **Continuous Documentation Synchronization**:  
   As specified in the development workflow, every completed task, architectural update, or schema refinement must be reflected back in the project documentation. If decisions or deviations are explicitly requested by the user, the agent must update the relevant sections of [BLUEPRINT.md](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md) and [DESIGN.md](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md) to preserve documentation integrity.
5. **Quality Bar Enforcement (DESIGN.md §65)**:  
   No prototype placeholders or incomplete stub states. All screens must feature complete loading skeletons/indicators, empty states, error fallbacks, and responsive layout handling.

---

## 2. BLUEPRINT ARCHITECTURE & SPECIFICATION REFERENCE

### 2.1 Core Product Principles
* **Frictionless Discovery**: Zero initial barrier to entry. Users must be able to explore movies, search catalog titles, and view details immediately without being forced to create an account or sign in ([BLUEPRINT.md §1](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md#L18-L22), [DESIGN.md §1](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md#L26-L35)).
* **Local-First Persistence**: Guest users store favorites locally via `@react-native-async-storage/async-storage` wrapped in Zustand. Local favorites persist across app restarts ([BLUEPRINT.md §1](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md#L20), [DESIGN.md §51](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md#L1504-L1516)).
* **Seamless Cloud Transition & Non-Destructive Migration**: When a guest user logs in or registers via Supabase, their existing local favorites are automatically merged into their Supabase cloud library without duplicates and **without ever erasing local or cloud items** ([BLUEPRINT.md §1](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md#L21), [DESIGN.md §9](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md#L224-L246), [DESIGN.md §52](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md#L1526-L1540)).

---

### 2.2 Navigation Architecture & Screen Inventory
The application follows a mobile-first hierarchy leveraging Expo Router ([BLUEPRINT.md §4](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md#L93-L104), [DESIGN.md §6-§12](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md#L147-L300)):

```
src/app/
├── _layout.tsx                     # Root stack layout (Theme, session bootstrap, modals)
├── (tabs)/                         # Persistent bottom tab navigation (4 tabs)
│   ├── _layout.tsx                 # Tab bar styling & iconography
│   ├── index.tsx                   # Discover / Home (Featured hero, rails)
│   ├── explore.tsx / search.tsx    # Search & Explore (Query input, genre chips, results grid)
│   ├── favorites.tsx               # Favorites Hub (Guest badge / Synced badge, watchlist grid)
│   └── profile.tsx                 # Profile Screen (Guest CTA or Authenticated details)
├── onboarding.tsx                  # 3-slide Onboarding Carousel (Discover, Favorites, Sync)
├── movie/
│   └── [id].tsx                    # Movie Details (Backdrop hero, metadata, synopsis, favorite toggle)
└── auth.tsx                        # Auth Modal / Screen (Sign In, Sign Up, guest continue)
```

#### Bottom Navigation Specification (DESIGN.md §7)
1. **Home** (`/(tabs)/index`): House icon — Primary browsing, Hero movie, Trending, Top Rated, Categories.
2. **Search** (`/(tabs)/explore`): Magnifying glass — Dynamic search bar, genre chips, zero-state, results grid.
3. **Favorites** (`/(tabs)/favorites`): Heart icon — Saved titles, empty state CTA, sync status header banner.
4. **Profile** (`/(tabs)/profile`): Person avatar — Guest login banner, account stats, sign out button.

---

### 2.3 Visual Design System & Theme Tokens (DESIGN.md §13-§18, BLUEPRINT.md §5)
Strictly utilize the **Dark Cinematic** design system. Do **not** invent alternative colors, bright backgrounds, or generic corporate styling.

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Background Root** | `#08090D` / `#0A0D14` | Primary screen canvas background |
| **Surface / Card** | `#141923` | Movie cards, elevated surfaces, list containers |
| **Surface Elevated / Border** | `#202736` / `#2D3748` | Card borders, divider lines, search inputs |
| **Accent Primary** | `#E50914` (Cinema Red) | Hero CTAs, active tab highlights, favorite heart active |
| **Accent Secondary** | `#F5C518` (Rating Gold) | Star icons, IMDb rating badges |
| **Text Primary** | `#FFFFFF` | Titles, headings, active labels |
| **Text Secondary** | `#9CA3AF` | Subtitles, release year, runtime metadata |
| **Text Muted** | `#6B7280` | Placeholders, inactive icons, captions |

#### Typography & Spacing Rules (DESIGN.md §15-§16)
* **Font Scale**: `xs` (11px), `sm` (13px), `md` (15px), `lg` (18px), `xl` (22px), `xxl` (28px).
* **Grid**: Strict 4px scale (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`).
* **Corner Radii**: Cards (`12px` to `16px`), Buttons (`8px` to `12px`), Pills (`9999px` full-rounded).
* **Card & Poster Aspects (DESIGN.md §19, §55)**:
  * Posters **must preserve standard 2:3 aspect ratio** (`aspect-[2/3]`).
  * Never stretch or distort movie poster images.
  * Image loading must use progressive placeholders and smooth fade-in transitions.
  * Backdrops must feature gradient scrim overlays (`LinearGradient` from transparent to `#08090D`).

---

### 2.4 Data Architecture & TypeScript Interfaces (BLUEPRINT.md §6, DESIGN.md §47)

```typescript
// src/types/index.ts
export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number; // e.g. 8.4
  releaseYear: number;
  genres: string[];
  durationMinutes: number;
}

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
}
```

---

### 2.5 State Management Architecture (Zustand 5) (BLUEPRINT.md §6, DESIGN.md §50)

Agents must organize client state into clean, decoupled Zustand stores:

1. **`useOnboardingStore`** (`src/stores/onboarding-store.ts`):
   * State: `hasCompletedOnboarding: boolean`
   * Actions: `completeOnboarding()`, `resetOnboarding()`
   * Storage: Persisted via `@moviebox_onboarding` in AsyncStorage.
2. **`useAuthStore`** (`src/stores/auth-store.ts`):
   * State: `user: User | null`, `session: Session | null`, `isGuest: boolean`, `isLoading: boolean`
   * Actions: `signIn(email, password)`, `signUp(email, password)`, `signOut()`, `continueAsGuest()`, `initializeAuth()`
3. **`useFavoritesStore`** (`src/stores/favorites-store.ts`):
   * State: `favorites: Movie[]`, `isLoading: boolean`, `isHydrated: boolean`
   * Actions: `isFavorite(id)`, `toggleFavorite(movie)`, `addFavorite(movie)`, `removeFavorite(id)`, `syncWithCloud(userId)`, `migrateGuestFavorites(userId)`
   * Storage: Hydrated locally via `@moviebox_favorites` with background Supabase sync.
4. **`useAppStore`** (`src/stores/app-store.ts`):
   * State: `isInitialized: boolean`, `networkState: 'online' | 'offline'`

---

### 2.6 Supabase Cloud Database & RLS Rules (BLUEPRINT.md §6.C, DESIGN.md §48-§49)

Database schema must match the following table definition:

```sql
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  movie_id text not null,
  movie_data jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, movie_id)
);

-- Row Level Security (Mandatory)
alter table public.favorites enable row level security;

create policy "Users can select own favorites"
  on public.favorites for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on public.favorites for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.favorites for delete
  using (auth.uid() = user_id);
```

---

### 2.7 Synchronization & Guest Migration Rules (DESIGN.md §51-§52)

When migrating or syncing favorites:
1. **Never erase cloud favorites** merely because they are missing locally.
2. **Never erase local favorites** before confirmation from Supabase.
3. **Migration Steps**:
   * Step 1: Read local guest favorites from AsyncStorage.
   * Step 2: Fetch cloud favorites from Supabase for `auth.uid()`.
   * Step 3: Compute union set ($Local \cup Cloud$) and deduplicate by `movie_id`.
   * Step 4: Batch insert any local-only favorites into Supabase.
   * Step 5: Update the local store with the merged state.
   * Step 6: Clear the pending guest migration flag only after the cloud insert succeeds.

---

### 2.8 App Startup Sequence (DESIGN.md §53)
The app must execute startup operations in this exact order:
1. Display Splash Screen (`expo-splash-screen`).
2. Hydrate Zustand persisted stores (`useOnboardingStore`, `useFavoritesStore`).
3. Restore active Supabase session via `supabase.auth.getSession()`.
4. If authenticated, trigger non-blocking cloud favorites synchronization in the background.
5. Hide Splash Screen and route to `/onboarding` (first launch) or `/(tabs)` (returning).

---

## 3. COMPONENT INVENTORY & REUSABILITY (DESIGN.md §54)

Construct modular, single-responsibility components in `src/components/`:
* **UI Atom**: `AppButton`, `IconButton`, `RatingBadge`, `GenreChip`, `SectionHeader`, `ScreenContainer`.
* **Movie Components**: `MovieCard`, `MovieRail` (horizontal scroll), `MovieGrid` (2-column search/favorites), `MovieHero` (featured backdrop banner), `FavoriteButton` (animated heart toggle).
* **Feedback States**: `LoadingMovieCard` (skeleton pulse), `EmptyState` (with actionable CTA), `ErrorState` (with retry button), `GuestSyncBanner` (prompts guest in Favorites tab).

---

## 4. AGENT OPERATING DIRECTIVES & CONSTRAINTS

### MUST DO
- **Adhere to Documents**: Validate every change against [BLUEPRINT.md](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md) and [DESIGN.md](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md).
- **Graceful Supabase Fallback**: If Supabase credentials (`EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`) are missing, the app **must not crash**; fallback to full guest mode with local persistence and clear status banners.
- **Platform Polish**: Support iOS safe area insets (`react-native-safe-area-context`), Android gesture navigation, and fast responsive interactions.
- **Verify with Typecheck & Lint**: Run `npm run lint` and verify TypeScript compilation on all added code.

### MUST NOT DO
- **Do NOT build out-of-scope features**: No video trailer players, payment gateways, reviews, or social features.
- **Do NOT introduce inconsistent styling**: Never use light theme backgrounds, random Tailwind color utilities outside the palette, or unstyled raw buttons.
- **Do NOT block boot sequence**: Never block the entire application on slow remote network calls during startup.
- **Do NOT overwrite or delete documentation**: Keep [BLUEPRINT.md](file:///Users/apple/Downloads/AustinMovieBox/BLUEPRINT.md), [DESIGN.md](file:///Users/apple/Downloads/AustinMovieBox/DESIGN.md), and [AGENT.md](file:///Users/apple/Downloads/AustinMovieBox/AGENT.md) synchronized and accurate.

---

## 5. MVP ACCEPTANCE CRITERIA CHECKLIST (BLUEPRINT.md §8, DESIGN.md §60)

Before marking any milestone or task complete, ensure the following are verified:

- [x] **Onboarding**: Displays 3 slides on first launch; can be skipped or completed; persists completion in AsyncStorage.
- [x] **Catalog Browsing**: Home tab loads curated movies, featured hero banner, and responsive horizontal rails (Trending Now, Popular Movies, Top Rated, New Releases).
- [x] **Search & Explore**: Live query filtering works smoothly; genre chips filter catalog; proper empty & no-results states exist.
- [x] **Movie Details**: Modal/screen displays poster backdrop, rating, metadata, genres, overview, and favorite heart toggle.
- [x] **Guest Favorites**: Guests can favorite/unfavorite movies with instant UI update; saved favorites persist across app reload.
- [x] **Supabase Auth**: Sign up, sign in, sign out with session persistence; validation and error messaging.
- [x] **Cloud Sync & Migration**: Guest favorites merge into user's account upon sign-in/sign-up without duplicates or data loss.
- [x] **Quality Bar**: All empty, loading, and error states present; no visual glitches or unhandled exceptions; responsive across mobile, tablet, and desktop viewports.
