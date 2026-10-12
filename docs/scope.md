# Austin MovieBox — Scope & Boundaries (`scope.md`)

> **Document**: Functional Scope, MVP Boundaries, Non-Goals & Assumptions  
> **Application**: Austin MovieBox (MovieBox MVP)  
> **Version**: 1.0.0  
> **Status**: Approved & Specified  

---

## 1. Scope Definition & Philosophy

The MovieBox MVP is scoped to deliver a complete, fast, cinematic, and production-ready movie discovery and favorites application. To achieve high quality, performance, and reliability, the feature set is strictly bounded. Core discovery and bookmarking capabilities are polished to production standards, while extraneous features (video players, payments, social commentary) are intentionally deferred.

---

## 2. In-Scope MVP Features

### 2.1 Onboarding Experience
- **Multi-Slide Carousel**: 3 illustrated, high-impact onboarding slides:
  1. *Discover Cinematic Releases*: Highlighting trending, popular, and top-rated titles.
  2. *Instant Local Favorites*: Highlighting instant bookmarking with zero sign-up required.
  3. *Cloud Sync Across Devices*: Explaining how optional account creation protects and syncs favorites.
- **Navigation Controls**: "Skip" button to bypass directly to the home screen; "Next" step progression; "Get Started" completion CTA on the final slide.
- **Persistence Flag**: Stores `@moviebox_onboarding` boolean in `AsyncStorage` so returning users are automatically routed to the Home feed without seeing onboarding again.

### 2.2 Movie Discovery & Home Screen (`/(tabs)/index`)
- **Brand Header**: Subtle app wordmark/logo with quick navigation shortcuts.
- **Featured Hero Banner**:
  - Occupies 45%–55% of mobile viewport height.
  - High-resolution cinematic backdrop image.
  - Multi-stop gradient scrim (`LinearGradient`) transitioning from transparent to `#08090D`.
  - Movie title, release year, genre tags, IMDb rating badge.
  - Concise synopsis excerpt.
  - "View Details" primary CTA and interactive Favorite heart button.
- **Horizontal Movie Rails**:
  - Categorized rails: *Trending Now*, *Popular Movies*, *Top Rated*, and *New Releases*.
  - Section headers with optional "See All" indicator.
  - Horizontally scrollable lists of poster cards.
  - Poster cards enforcing strict 2:3 aspect ratio (`aspect-[2/3]`) with subtle corner radii and rating overlay.
- **Vertical Feed Layout**: Fluid scrolling container hosting the hero banner and multiple content rails.

### 2.3 Search & Genre Exploration (`/(tabs)/search`)
- **Live Search Input**: Prominent search bar with magnifying glass icon, real-time query listening, and a clear ("X") button when text is present.
- **Genre Filter Chips**: Horizontal scroll of selectable genre pills (*All*, *Action*, *Sci-Fi*, *Drama*, *Thriller*, *Animation*, *Comedy*, *Romance*). Tapping filters the catalog dynamically.
- **Responsive Results Grid**: 2-column poster grid rendering matched movies with poster, title, release year, rating, and favorite toggle.
- **Comprehensive State Coverage**:
  - *Initial Idle State*: Explanatory prompt encouraging the user to search.
  - *Active Results*: Responsive poster grid updating with sub-100ms perceived latency.
  - *No Results State*: Friendly message ("No movies found matching...") with a one-tap "Clear Filters" CTA.

### 2.4 Movie Details Experience (`/movie/[id]`)
- **Dynamic Routing**: Accessible via `/movie/[id]` from Home, Search, or Favorites.
- **Backdrop Header**: Expansive full-width backdrop with safe area back navigation and quick share mock action.
- **Primary Metadata**: Poster thumbnail, film title, release year, duration in minutes, star rating badge.
- **Genre Pills**: Styled pills highlighting film categories.
- **Synopsis Section**: Complete storyline overview formatted for optimal typographic readability.
- **Credits & Personnel**: Director name and top billed cast list.
- **Interactive Favorite Button**: Prominent heart toggle providing immediate visual confirmation and state synchronization.

### 2.5 Favorites Hub & Local Storage (`/(tabs)/favorites`)
- **Guest-First Persistence**: Unauthenticated users can add and remove favorites freely. All items persist in `@moviebox_favorites` across app terminations and device reboots.
- **2-Column Watchlist Grid**: Clean visual grid of bookmarked films with quick remove/unfavorite action and tap-to-details routing.
- **Guest Sync Banner**: Non-intrusive prompt informing guests that signing in enables multi-device cloud synchronization.
- **Authenticated Cloud Badge**: Confirms to logged-in users that their library is backed up and synced.
- **Zero-State View**: Beautiful empty state with film icon, "No favorites yet" heading, descriptive copy, and a direct "Discover Movies" CTA button.

### 2.6 Supabase Authentication & Profile (`/auth`, `/(tabs)/profile`)
- **Supabase GoTrue Integration**:
  - Email and password registration (Sign Up).
  - Email and password authentication (Sign In).
  - Secure session restoration on app boot via AsyncStorage adapter.
  - Sign-out handling with clean session reset.
- **Auth Modal Sheet**:
  - Segmented toggle between "Sign In" and "Sign Up".
  - Field validation (valid email format, password minimum length).
  - Inline error alerts for incorrect credentials or connection errors.
  - Guest continuation shortcut.
- **Profile Hub Screen**:
  - *Guest View*: Avatar, "You're browsing as a guest" title, synchronization benefits list, and buttons for "Create Account" or "Sign In".
  - *Authenticated View*: User email, account created date, total favorite count, "Cloud Synced" indicator, and secondary "Sign Out" button.

### 2.7 Non-Destructive Cloud Synchronization
- **Union Merge Engine**: When a guest user logs in or registers:
  $$\text{Merged Set} = \text{Local Favorites} \cup \text{Cloud Favorites}$$
- **Duplicate Prevention**: Deduplication keyed on unique `movie_id`.
- **Zero Data Loss Guarantee**: Local items are never wiped before confirming cloud writes; existing remote cloud items are never deleted during guest sign-in.
- **Automatic Cloud Sync**: Once authenticated, toggling favorites immediately syncs changes to Supabase PostgreSQL table `public.favorites`.

### 2.8 Platform Polish & Resilience
- **Dark Cinema Visual Foundation**: Standardized on dark theme tokens (`#08090D` canvas, `#141923` cards, `#E50914` Cinema Red, `#F5C518` Rating Gold). Zero bright fallbacks.
- **Safe Area & Responsive Layout**: Proper handling of iOS notches, Dynamic Island, Android navigation bars, and responsive scaling from small phones (360px) to tablets (768px+).
- **Offline & Credential Fallback**: If Supabase API keys are unconfigured or the device loses internet access, the app gracefully operates in guest mode without crashing.

---

## 3. Explicitly Out-of-Scope Features (Non-Goals)

To protect delivery focus and prevent bloat, the following capabilities are strictly excluded from the MVP:

| Feature | Rational for Exclusion |
| :--- | :--- |
| **Video Trailer Playback** | Heavy media players add native build dependencies, memory overhead, and licensing complexities. |
| **User Reviews & Comments** | Requires complex content moderation, reporting flows, and anti-spam infrastructure. |
| **Payment & Subscriptions** | The MVP is entirely free to browse; no paywalls, in-app purchases, or payment gateway APIs. |
| **Social Feeds & Messaging** | Social graphs and peer messaging are orthogonal to core personal discovery and watchlist curation. |
| **Complex AI Recommendations** | Machine learning recommendation engines require extensive user telemetry; curated rails provide superior MVP value. |
| **Offline Video Downloading** | App is a discovery and bookmarking tool, not a video playback service. |
| **TV Casting (AirPlay/Cast)** | Native casting protocols introduce substantial platform complexity unnecessary for a mobile catalog. |
| **Multi-Profile Households** | Single-user account profiles keep auth and synchronization contracts straightforward. |
| **Admin Web Dashboard** | Catalog content is served via static or public API data; no back-office CMS required in MVP. |

---

## 4. Technical & System Assumptions

1. **Target Runtime**: Expo SDK 57 on React Native 0.86, running on iOS 15.0+, Android 10+, and modern web browsers.
2. **Device Hardware**: Minimum 2GB RAM; touch-first mobile interface; minimum network speed 3G for initial asset loading.
3. **Data Source**: Curated, high-fidelity mock movie dataset stored locally in `src/data/movies.ts` providing realistic posters, backdrops, ratings, and synopses with zero external API rate-limit dependencies.
4. **Backend Infrastructure**: Supabase cloud instance running PostgreSQL 15+ with GoTrue auth enabled.
5. **Security Model**: Supabase Row Level Security (RLS) enforcing that users can only select, insert, and delete rows matching their authenticated `auth.uid()`.

---

## 5. Risks & Mitigation Strategies

| Identified Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Missing / Invalid Supabase Keys** | App crash on launch | Implemented defensive client check in `src/services/supabase.ts` that falls back to guest mode with informative UI badges. |
| **Network Failure During Migration** | Loss of guest favorites | Guest favorites remain in local AsyncStorage until Supabase confirms successful write of the union set. |
| **Image Loading Latency** | Janky scrolling or blank cards | Use `expo-image` with aggressive memory caching, blurhash placeholders, and crossfade transitions. |
| **Poster Distortion Across Screen Sizes** | Degraded visual polish | Strict `aspect-[2/3]` constraints in Tailwind/NativeWind ensuring standard movie poster proportions across all viewports. |
