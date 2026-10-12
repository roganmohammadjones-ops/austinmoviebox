# Austin MovieBox — User Flows & Interaction Sequences (`user-flows.md`)

> **Document**: End-to-End User Journeys, Transition Logic & Interaction State Diagrams  
> **Application**: Austin MovieBox (MovieBox MVP)  
> **Version**: 1.0.0  
> **Status**: Approved & Specified  

---

## 1. Master System Flow Diagram

The complete navigation and operational logic across guest and authenticated lifecycle states is mapped below:

```mermaid
flowchart TD
    Launch([App Launch]) --> CheckOnboarding{Has Completed Onboarding?}
    CheckOnboarding -- No --> OnboardingScreen[3-Slide Onboarding Carousel]
    OnboardingScreen -->|Finish / Skip| SetOnboardingDone[Persist Flag: @moviebox_onboarding] --> Home[Home / Discover Tab]
    CheckOnboarding -- Yes --> Home

    Home --> Browse[Browse Hero Banner & Movie Rails]
    Home --> Search[Search Tab: Live Query & Genre Chips]
    Home --> Detail[Open Movie Details: /movie/:id]

    Detail --> ToggleFav{Toggle Favorite Button}
    Browse --> ToggleFav

    ToggleFav --> CheckAuth{Is User Authenticated?}
    CheckAuth -- No (Guest) --> LocalSave[Save to AsyncStorage: @moviebox_favorites]
    CheckAuth -- Yes --> CloudSave[Save to Supabase public.favorites & Local State]

    Home --> NavFav[Navigate to Favorites Tab]
    NavFav --> ViewFavs[View Saved Watchlist]
    ViewFavs --> HasItems{Any Saved Favorites?}
    HasItems -- No --> EmptyFavs[Render Empty State with 'Discover Movies' CTA]
    HasItems -- Yes --> FavList[Render 2-Column Poster Grid]

    Home --> Profile[Navigate to Profile Tab]
    Profile --> AuthAction{Sign In or Sign Up}
    AuthAction --> SupabaseAuth[Authenticate via Supabase GoTrue]
    SupabaseAuth --> MergeFavorites[Run Non-Destructive Union Merge Engine]
    MergeFavorites --> CloudSyncedState[Durable Cloud Favorites across Devices]
```

---

## 2. Flow 1: First-Time Guest Discovery & Local Bookmarking

This is the primary frictionless entry path for a brand new user who has just downloaded the app.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as MovieBox Client
    participant OS as useOnboardingStore
    participant FS as useFavoritesStore
    participant Local as AsyncStorage

    User->>App: Launch App for the first time
    App->>OS: Check hasCompletedOnboarding
    OS->>Local: Read @moviebox_onboarding (returns null/false)
    App->>User: Render Onboarding Carousel (/onboarding)
    User->>App: Swipe through slides (or tap "Skip")
    User->>App: Tap "Get Started"
    App->>OS: completeOnboarding()
    OS->>Local: Write @moviebox_onboarding = true
    App->>User: Route to Home Screen (/(tabs)/index)
    User->>App: Browse Hero Banner and Trending Rail
    User->>App: Tap Movie Card (e.g. "Dune: Part Two")
    App->>User: Open Movie Details (/movie/1)
    User->>App: Tap Favorite Heart Icon
    App->>FS: toggleFavorite(movie)
    FS->>Local: Persist updated array to @moviebox_favorites
    App->>User: Heart turns filled Red (#E50914) instantly (Optimistic UI)
    User->>App: Tap Favorites Tab (/(tabs)/favorites)
    App->>User: Render 2-Column Grid showing "Dune: Part Two" + Guest Sync Banner
```

### Key Experience Highlights
- **Zero Interruption**: No email prompts, phone verification, or password setup.
- **Immediate Feedback**: Heart button illuminates within 16ms (single frame).
- **Persistent Storage**: Force-closing the app at this point preserves the saved favorite.

---

## 3. Flow 2: Guest-to-Account Cloud Migration (Non-Destructive Merge)

When a guest user who has accumulated local favorites decides to sign in or create an account, their local items are preserved and merged with cloud data.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as MovieBox Client
    participant AuthModal as /auth Modal
    participant AuthStore as useAuthStore
    participant FavStore as useFavoritesStore
    participant SyncService as cloud-sync.ts
    participant Supa as Supabase Cloud (Postgres)

    User->>App: On Favorites tab, tap "Sign In to Sync" banner
    App->>AuthModal: Open Auth Modal (/auth)
    User->>AuthModal: Select "Sign Up" tab, enter email and password
    User->>AuthModal: Tap "Create Account"
    AuthModal->>AuthStore: signUp(email, password)
    AuthStore->>Supa: supabase.auth.signUp(...)
    Supa-->>AuthStore: Returns User Session (user.id = uuid-123)
    AuthStore-->>AuthModal: Authentication Successful
    App->>FavStore: Trigger migrateGuestFavorites(uuid-123)
    FavStore->>SyncService: syncGuestFavoritesWithCloud(localFavs, uuid-123)
    SyncService->>Supa: Query SELECT * FROM public.favorites WHERE user_id = uuid-123
    Supa-->>SyncService: Return existing remote favorites (RemoteItems)
    Note over SyncService: Compute Union: LocalFavorites ∪ RemoteItems (Deduplicated by movie_id)
    SyncService->>Supa: Batch INSERT new local-only favorites into public.favorites
    Supa-->>SyncService: 201 Created confirmation
    SyncService-->>FavStore: Return complete merged movie array
    FavStore->>FavStore: Update Zustand state & hydrate AsyncStorage
    App->>User: Close modal, show "Synced" badge on Profile and Favorites
```

### Non-Destructive Invariants
1. **Never Overwrite**: Remote items present in Supabase are never deleted during registration.
2. **Never Discard**: Local guest items are never discarded; they are uploaded and unioned.
3. **Rollback Resilience**: If network drops during upload, local items remain cached on device.

---

## 4. Flow 3: Returning Authenticated User Startup

When an existing registered user opens the application on their primary device.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as MovieBox Client
    participant Boot as _layout.tsx Bootstrap
    participant Supa as Supabase GoTrue
    participant FavStore as useFavoritesStore
    participant Local as AsyncStorage

    User->>App: Launch App
    App->>Boot: Initialize Root Layout
    Boot->>Local: Hydrate @moviebox_onboarding (true)
    Boot->>Supa: supabase.auth.getSession()
    Supa-->>Boot: Active session restored (user logged in)
    Boot->>FavStore: Hydrate @moviebox_favorites from cache
    Boot->>App: Render Home Feed (/(tabs)/index) immediately (Zero Spinner)
    par Background Cloud Sync
        Boot->>FavStore: syncWithCloud(user.id)
        FavStore->>Supa: Fetch latest public.favorites
        Supa-->>FavStore: Return remote records
        FavStore->>Local: Update local cache with remote changes
    end
```

### Key Experience Highlights
- **Instant Boot**: Screen renders immediately using local AsyncStorage cache without waiting for remote network roundtrips.
- **Background Sync**: Fresh favorites synchronization occurs silently in the background.

---

## 5. Flow 4: Sign-In From a New / Secondary Device

When an authenticated user installs MovieBox on a second phone or tablet.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as MovieBox Client
    participant AuthModal as /auth Modal
    participant Supa as Supabase Cloud
    participant FavStore as useFavoritesStore

    User->>App: Open fresh app on new phone
    User->>App: Skip onboarding to Home screen
    User->>App: Navigate to Profile Tab (/(tabs)/profile)
    User->>App: Tap "Sign In"
    App->>AuthModal: Open Auth Sheet
    User->>AuthModal: Enter existing email & password, tap "Sign In"
    AuthModal->>Supa: supabase.auth.signInWithPassword(...)
    Supa-->>AuthModal: Session granted
    AuthModal->>FavStore: syncWithCloud(user.id)
    FavStore->>Supa: SELECT * FROM public.favorites WHERE user_id = auth.uid()
    Supa-->>FavStore: Returns user's cloud favorites
    FavStore->>FavStore: Populate local Zustand store & persist to AsyncStorage
    App->>User: Navigate to Favorites Tab -> Entire watchlist appears instantly
```

---

## 6. Flow 5: Search & Genre Filtering Engine

How users search, filter by genre, and handle empty states.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant SearchScreen as search.tsx
    participant Catalog as movies.ts
    participant Details as /movie/:id

    User->>SearchScreen: Tap Search Tab (/(tabs)/search)
    SearchScreen->>User: Display search input, genre chips, and full movie grid
    User->>SearchScreen: Tap genre chip "Sci-Fi"
    SearchScreen->>SearchScreen: Filter catalog by genre === "Sci-Fi"
    SearchScreen->>User: Grid updates dynamically showing Sci-Fi titles
    User->>SearchScreen: Type query "Dune" in search bar
    SearchScreen->>SearchScreen: Filter catalog by (title.includes("Dune") && genre === "Sci-Fi")
    SearchScreen->>User: Grid narrows to "Dune: Part Two"
    User->>SearchScreen: Type query "Unicorn" (No match)
    SearchScreen->>User: Render No Results state with "Clear Filters" CTA
    User->>SearchScreen: Tap "Clear Filters"
    SearchScreen->>SearchScreen: Reset query to "" and genre to "All"
    SearchScreen->>User: Full catalog restored
    User->>SearchScreen: Tap movie card
    SearchScreen->>Details: Navigate to /movie/:id
```

---

## 7. Flow 6: Offline Resilience & Graceful Fallback

How the application behaves when disconnected from the internet or running without Supabase credentials.

```mermaid
flowchart TD
    Launch([App Launch]) --> CheckKeys{Are Supabase Keys in .env?}
    CheckKeys -- Missing / Empty --> SetGuestMode[Enter Offline Guest Mode]
    CheckKeys -- Present --> CheckNet{Is Network Connected?}
    CheckNet -- Offline --> SetOfflineMode[Enter Offline Mode]
    CheckNet -- Online --> FullOnline[Standard Cloud Operation]

    SetGuestMode --> AllowLocalUse[Enable Complete Local Browsing & Bookmarks]
    SetOfflineMode --> AllowLocalUse

    AllowLocalUse --> FavAction[User Adds / Removes Favorites]
    FavAction --> PersistLocal[Write to AsyncStorage: @moviebox_favorites]
    PersistLocal --> UpdateUI[Update UI Optimistically]
    UpdateUI --> ProfileNotice[Profile & Favorites display 'Offline / Local' indicator]
    ProfileNotice --> ZeroCrash([Zero Unhandled Exceptions or App Freezes])
```
