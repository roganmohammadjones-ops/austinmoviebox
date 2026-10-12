# MovieBox — QA Testing & Verification Guide (`TESTING.md`)

This guide provides step-by-step instructions for testing and verifying all user flows, persistence mechanisms, and quality bar requirements in MovieBox.

---

## 🧪 1. Static Analysis & Type Checking

Run the following commands in the workspace root:

```bash
# 1. TypeScript Verification (Must pass with 0 errors)
npx tsc --noEmit

# 2. Linting Verification
npm run lint
```

---

## 📱 2. Manual End-to-End User Verification Flows

### Flow 1: First-Time User & Onboarding
1. Launch the app on a fresh simulator/device or clear AsyncStorage.
2. **Verify**: The 3-slide onboarding carousel is displayed (`/onboarding`).
3. Swipe through slides:
   - Slide 1: Discover cinematic releases.
   - Slide 2: Save favorites instantly without login.
   - Slide 3: Cloud sync across devices.
4. Tap "Skip" or "Get Started".
5. **Verify**: Routed to the Home screen (`/(tabs)`).
6. Kill and relaunch the app.
7. **Verify**: Onboarding does **not** reappear; the user lands directly on the Home screen.

---

### Flow 2: Frictionless Catalog Browsing & Search
1. On the Home screen (`/(tabs)/index`):
   - **Verify**: Featured Hero Movie banner displays high-res backdrop, rating badge, and action buttons.
   - **Verify**: Horizontal rails (Trending, Popular, Top Rated) scroll smoothly.
   - **Verify**: Movie posters maintain strict 2:3 aspect ratio without stretching.
2. Tap the **Search** tab (`/(tabs)/search`):
   - **Verify**: Search input is responsive. Type a movie title (e.g., "Inception" or "Dune").
   - **Verify**: Results filter in real-time.
   - Tap genre chips (e.g. "Sci-Fi", "Action").
   - **Verify**: The grid updates dynamically to show only movies matching the selected genre.
   - Type an invalid string (e.g. "xyzabc").
   - **Verify**: Empty state is displayed with a "Clear Search" button.

---

### Flow 3: Movie Details & Favorite Heart Toggle
1. Tap any movie card from Home, Search, or rails.
2. **Verify**: Navigates to `/movie/[id]`.
3. **Verify**: Movie details screen displays backdrop hero, release year, runtime, star rating, genre pills, full synopsis, and director/cast list.
4. Tap the **Favorite** heart button in the top right or action bar:
   - **Verify**: The heart toggles to active filled red (`#E50914`).
   - Navigate back to the previous screen.
   - **Verify**: The movie card reflects the favorited state.

---

### Flow 4: Guest Mode Persistence
1. While not signed in, favorite 2 or 3 movies.
2. Navigate to the **Favorites** tab (`/(tabs)/favorites`):
   - **Verify**: The favorited movies appear in the 2-column grid.
   - **Verify**: The "Guest Mode" banner appears at the top prompting the user to sign in to sync.
3. Completely quit and restart the application.
4. Navigate back to the **Favorites** tab:
   - **Verify**: All previously favorited movies are still present.
5. Tap the trash or unfavorite icon on one movie:
   - **Verify**: It is immediately removed from the grid.
   - If all movies are removed, verify the empty state appears with "Explore Movies" CTA button.

---

### Flow 5: Supabase Auth & Non-Destructive Cloud Migration
1. With 1-2 favorites saved in Guest mode, navigate to the **Profile** tab (`/(tabs)/profile`).
2. Tap **Sign In / Create Account**:
   - **Verify**: The auth modal appears with email and password fields.
3. Switch to "Sign Up" mode and register a new account (or sign in to an existing account).
4. After successful authentication:
   - **Verify**: User email is shown on the Profile screen with a "Synced" badge.
   - Navigate to the **Favorites** tab.
   - **Verify**: The guest favorites are preserved and now synchronized to Supabase `public.favorites`.
   - **Verify**: The Guest banner disappears or shows a "Cloud Synced" status.
5. In the Supabase Dashboard, inspect `public.favorites` table:
   - **Verify**: Rows exist matching `user_id = auth.uid()` with the movie JSON payload.
6. Sign out from the Profile screen:
   - **Verify**: Session is cleared, status returns to Guest mode.
