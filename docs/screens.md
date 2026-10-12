# Austin MovieBox — Screen Inventory & UI Specifications (`screens.md`)

> **Document**: Comprehensive Screen Inventory, Visual Hierarchy & Component Specifications  
> **Application**: Austin MovieBox (MovieBox MVP)  
> **Version**: 1.0.0  
> **Status**: Approved & Specified  

---

## 1. Master Screen Inventory

The MovieBox application consists of the following core screens, modals, and specialized visual states:

| Screen / View | Route Path | Navigation Type | Primary Role |
| :--- | :--- | :--- | :--- |
| **Splash Screen** | Native Root | App Bootstrap | Brand presentation & store/session hydration |
| **Onboarding** | `/onboarding` | Fullscreen Stack | 3-slide value introduction & guest entrance |
| **Home / Discover** | `/(tabs)/index` | Bottom Tab 1 | Primary browsing hub: Hero banner & horizontal rails |
| **Search & Explore**| `/(tabs)/search` | Bottom Tab 2 | Live query input, genre chips & 2-column results |
| **Favorites Hub** | `/(tabs)/favorites` | Bottom Tab 3 | User watchlist, guest sync banner & empty state |
| **Profile & Account**| `/(tabs)/profile` | Bottom Tab 4 | Guest sign-in prompt or authenticated stats & sign out |
| **Movie Details** | `/movie/[id]` | Fullscreen / Modal | In-depth movie metadata, backdrop, credits & favorite CTA |
| **Auth Modal** | `/auth` | Modal Sheet | Email/password sign-in and registration |

---

## 2. Screen Specifications

### 2.1 Splash Screen
- **Purpose**: App initialization, hydration of Zustand stores from `AsyncStorage`, and restoration of Supabase GoTrue session.
- **Visual Design**:
  - Background: Pure Cinema Canvas `#08090D`.
  - Centerpiece: Cinema brand logo / icon with subtle red accent glow.
  - Typography: "MOVIEBOX" in Outfit Bold (`#FFFFFF`), tracking +2px.
- **Behavior**:
  - Hides automatically once `useOnboardingStore` and `useFavoritesStore` report hydrated status.
  - Routes directly to `/onboarding` on first launch, or `/(tabs)` for returning users.

---

### 2.2 Onboarding Carousel (`/onboarding`)
- **Purpose**: Educates users on primary capabilities while maintaining frictionless guest access.
- **Visual Structure**:
  - Top Bar: "Skip" text button in top-right corner.
  - Central Stage: 3-step swipable carousel with custom illustrations and iconography.
    - **Slide 1 (Discovery)**: Film reel illustration. Headline: *"Discover Cinematic Masterpieces"*. Subtext: *"Explore trending, popular, and top-rated movies curated for true film lovers."*
    - **Slide 2 (Instant Favorites)**: Heart badge illustration. Headline: *"Bookmark Instantly, No Account Needed"*. Subtext: *"Save movies you want to watch with a single tap. Your list is stored securely on your device."*
    - **Slide 3 (Cloud Sync)**: Multi-device sync illustration. Headline: *"Take Your Watchlist Anywhere"*. Subtext: *"Create a free account anytime to seamlessly sync your favorites across all your phones and tablets."*
  - Bottom Controls:
    - Step Indicator: 3 animated pill dots (active: Cinema Red `#E50914`, inactive: `#202736`).
    - Primary Button: 52px button. Displays "Next" on slides 1–2, transitions to "Get Started" on slide 3.
- **Interactions**:
  - Tapping "Skip" or "Get Started" calls `completeOnboarding()` (persisting `@moviebox_onboarding = true`) and redirects to `/(tabs)/index`.

---

### 2.3 Home / Discover Screen (`/(tabs)/index`)
- **Purpose**: The primary browsing feed designed to showcase cinema artwork.
- **Visual Structure**:
  - **Header Bar**:
    - Left: Compact "MovieBox" brand logo with red cinema badge.
    - Right: Search shortcut icon and profile avatar button.
  - **Featured Hero Movie Banner**:
    - Height: 48% of screen height (`h-[48vh]`).
    - Background: Full-width high-resolution backdrop image.
    - Gradient Scrim: Multi-stop linear gradient transitioning from `transparent` at top to `#08090D` at bottom.
    - Content Overlay:
      - Category badge (e.g. *"FEATURED OF THE WEEK"*).
      - Movie Title in 28px bold heading.
      - Metadata Row: Release year (e.g. `2024`), genre pill (`Sci-Fi`), star rating badge (`★ 8.6`).
      - Synopsis excerpt (clamped to 2 lines).
      - Action Bar: Primary "View Details" button (52px Cinema Red) + circular Favorite heart toggle button.
  - **Horizontal Movie Rails**:
    - Four curated horizontal sections:
      1. *Trending Now*
      2. *Popular Movies*
      3. *Top Rated*
      4. *New Releases*
    - Rail Header: Section title (18px SemiBold) with optional "See All" text button.
    - Rail Scroll View: Horizontal scroll list with 16px inter-card gap and edge padding.
- **Movie Card Component**:
  - Strict 2:3 aspect ratio (`w-[140px] h-[210px]` on standard mobile; responsive scaling on tablets).
  - High-res poster image with `expo-image` cache.
  - Top-right rating pill overlay (`★ 8.4`).
  - Bottom content: Title (14px, 1-line truncation) and release year (`2024`).
  - Active heart icon indicator if currently in favorites.

---

### 2.4 Search & Explore Screen (`/(tabs)/search`)
- **Purpose**: Fast, interactive search and genre exploration.
- **Visual Structure**:
  - **Header**: Screen title *"Search & Explore"* (24px Bold).
  - **Search Input Bar**:
    - Container: `#141923` background with 1px border `#202736`, height 50px, rounded-2xl.
    - Leading icon: Search magnifying glass (`#6B7280`).
    - Input: Placeholder *"Search movies by title, actor, or genre..."*. Text `#FFFFFF`.
    - Trailing icon: Clear ("X") button visible whenever input text is non-empty.
  - **Horizontal Genre Filter Chips**:
    - Chips: *All*, *Action*, *Sci-Fi*, *Drama*, *Thriller*, *Animation*, *Comedy*, *Adventure*.
    - Active Chip: Cinema Red background (`#E50914`), white text.
    - Inactive Chip: Dark surface (`#141923`), border `#202736`, text `#9CA3AF`.
  - **Dynamic Results Grid**:
    - 2-column grid (`numColumns={2}`) with 16px column and row gaps.
    - Renders matched movie poster cards.
  - **State Views**:
    - *Idle State*: Friendly prompt icon and text *"Find your next favorite film"*.
    - *No Results State*: Film reel outline, headline *"No movies found"*, subtext *"Try checking your spelling or adjusting genre filters"*, and a "Clear Filters" button.

---

### 2.5 Movie Details Screen (`/movie/[id]`)
- **Purpose**: Deep-dive information on a selected movie.
- **Visual Structure**:
  - **Backdrop Header**:
    - Expansive backdrop image (height 320px).
    - Top Navigation Bar (inside Safe Area): Floating circular back button (chevron left) and floating Favorite heart toggle button.
    - Bottom Gradient: Smooth transition into `#08090D` background.
  - **Poster & Title Hero Card**:
    - Floating 2:3 poster thumbnail overlapping the backdrop boundary.
    - Title: Full movie title in 24px Bold.
    - Metadata Bar: Release year • Duration (e.g. `166 min`) • Rating badge (`★ 8.6 / 10`).
  - **Genre Badges**:
    - Horizontal wrapping row of rounded pills (e.g., `Sci-Fi`, `Adventure`, `Action`).
  - **Storyline / Synopsis**:
    - Section header *"Storyline"*.
    - Full synopsis text in `#D1D5DB`, 15px with 24px line height for readability.
  - **Personnel & Cast**:
    - Director card: Director label and name.
    - Top Cast: Comma-separated or chip-based cast listing.
  - **Floating / Bottom Action CTA**:
    - Full-width action button: "Add to Favorites" / "Remove from Favorites" with active color feedback.

---

### 2.6 Favorites Watchlist Screen (`/(tabs)/favorites`)
- **Purpose**: Personal watchlist management with guest and cloud sync support.
- **Visual Structure**:
  - **Header**: Screen title *"Favorites"* with total count badge (e.g. `(4)`).
  - **Sync Status Banner**:
    - *Guest Mode*: Container `#141923` with amber/red accent border. Message: *"Save favorites across all devices — Sign in or create an account."* Action button: *"Sync Now"*.
    - *Authenticated Mode*: Subtle green check indicator: *"Cloud Synced to your account"*.
  - **Watchlist 2-Column Grid**:
    - 2-column layout matching Search grid.
    - Each card displays poster, title, rating, and a top-right red heart toggle to remove.
  - **Empty Favorites State**:
    - Rendered when `favorites.length === 0`.
    - Large outlined heart icon in muted gray (`#374151`).
    - Headline: *"No favorites yet"*.
    - Subtitle: *"Tap the heart icon on any movie card to add it to your personal watchlist."*
    - Primary CTA: *"Discover Movies"* button (navigates to Home tab).

---

### 2.7 Profile & Account Screen (`/(tabs)/profile`)
- **Purpose**: Account management, sync status overview, and authentication gateway.
- **Guest State**:
  - User Avatar: Circular generic user icon with "Guest" label.
  - Headline: *"You're browsing as a guest"*.
  - Subtext: *"Your favorites are stored locally on this device."*
  - Benefits Card:
    - ✓ Sync favorites across multiple phones and tablets
    - ✓ Automatic cloud backup protecting against app re-installs
    - ✓ 100% free with zero spam
  - CTAs: Primary button *"Create Account"*, secondary button *"Sign In"*. Both open `/auth`.
- **Authenticated State**:
  - User Avatar: Profile initials avatar with active green status dot.
  - Email Display: Logged-in user email (`user@example.com`).
  - Stats Row: Number of saved favorites, account status (*Active / Synced*).
  - Settings Links: *Account Settings*, *Privacy Policy*, *About MovieBox*.
  - Danger Action: Secondary bordered button *"Sign Out"* with confirmation alert.

---

### 2.8 Auth Modal Screen (`/auth`)
- **Purpose**: Unified sign-in and registration flow.
- **Visual Structure**:
  - Drag handle / modal top bar with "Close" button.
  - Brand header: MovieBox icon with *"Welcome to MovieBox"*.
  - Segmented Mode Switcher: Tab bar toggling between *"Sign In"* and *"Create Account"*.
  - Form Fields:
    - Email address input (email keyboard, auto-capitalize none).
    - Password input with show/hide eye icon toggle.
  - Guest Migration Notice (in Sign Up mode): *"Your current guest favorites will automatically be synced to your new account."*
  - Error Alert Banner: Red warning container rendered on validation or auth error (e.g. *"Invalid login credentials"*).
  - Action Button: 52px Cinema Red CTA *"Sign In"* or *"Create Account"*.
  - Bottom Link: *"Continue as Guest"* dismisses modal.

---

## 3. Supporting States & Edge-Case Views

### 3.1 Skeleton Loading States
- Implemented with pulse animations using `#202736` base:
  - **Hero Skeleton**: Large 48vh rectangular skeleton with mock title and button placeholders.
  - **Movie Rail Skeleton**: Row of 4 poster-sized rectangles.
  - **Grid Skeleton**: 4–6 rectangular placeholders in a 2-column grid.

### 3.2 Error & Offline Fallback States
- **Network Offline Notice**: Non-blocking toast notification at top of screen (*"You are offline. Showing cached favorites."*).
- **Service Error View**: Friendly error illustration with *"Something went wrong"* message and a *"Try Again"* retry button.
