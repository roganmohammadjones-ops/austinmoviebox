# Movie App MVP — DESIGN.md

## 1. Project Overview

### Product

Movie discovery and favorites mobile application.

### Platform

- React Native
- Expo
- iOS
- Android

### Backend

- Supabase Authentication
- Supabase Postgres
- Supabase Row Level Security

### State Management

- Zustand

### Core Product Principle

Users must be able to begin using the application immediately without creating an account.

Guests can browse movies and maintain favorites locally.

Authenticated users receive cloud-synced favorites that remain available when they log into another device.

The experience should make authentication beneficial rather than mandatory.

---

# 2. Product Goal

Create a polished movie discovery application where users can:

- Discover popular movies
- Browse trending content
- Search for movies
- View detailed movie information
- Save movies as favorites
- Use favorites without registration
- Create an account when they want synchronization
- Access their favorites from multiple devices after signing in

The MVP should feel complete, fast, modern, cinematic, and production-ready.

---

# 3. Target Audience

Primary users:

- Movie fans
- Streaming audiences
- Mobile-first users
- Users looking for something to watch
- Users who want to maintain a personal movie watchlist/favorites library

The interface should remain understandable for both casual and advanced users.

---

# 4. MVP Scope

## Included

### Onboarding

- Welcome screen
- Movie discovery introduction
- Favorites introduction
- Account/cloud synchronization introduction
- Continue as guest
- Sign in
- Create account

### Authentication

- Email/password sign up
- Email/password sign in
- Sign out
- Session persistence
- Basic authentication error handling

### Movie Discovery

- Home
- Featured movie
- Trending movies
- Popular movies
- Movie categories
- Search
- Movie details

### Favorites

Guests:

- Save favorite movies locally
- Remove favorite movies
- Favorites survive application restart

Signed-in users:

- Save favorites in Supabase
- Remove cloud favorites
- Retrieve favorites on login
- Synchronize favorites between devices

### Account

- Profile
- Authentication status
- Favorite count
- Sign in prompt for guests
- Sign out for authenticated users

---

# 5. Not Included in MVP

Do not design these as primary MVP features:

- Movie streaming
- Payments
- Premium subscriptions
- Comments
- Social feeds
- Direct messaging
- Reviews written by users
- Complex recommendation AI
- Movie downloads
- Administrative dashboard
- TV casting
- Multi-profile household accounts

The architecture may allow these features later, but they should not clutter the MVP.

---

# 6. Navigation Architecture

Use a standard mobile navigation hierarchy.

## Root Navigation

### First Launch

Onboarding Stack

Then:

Main Application

### Returning User

Main Application

---

# 7. Main Bottom Navigation

Use four primary tabs:

1. Home
2. Search
3. Favorites
4. Profile

Bottom navigation should always remain easy to reach with one hand.

Use clear icons and short labels.

Recommended icons:

Home\
House icon

Search\
Magnifying glass

Favorites\
Heart

Profile\
Person/avatar

---

# 8. User Flows

## Flow A — First-Time Guest

Launch application

→ Welcome

→ Onboarding

→ Continue as Guest

→ Home

→ Browse movie

→ Open Movie Details

→ Tap Favorite

→ Movie stored locally

→ Favorites tab

→ Movie appears

---

# 9. Guest-to-Account Flow

Guest uses application

→ Saves several movies

→ Opens Favorites

→ Sees optional cloud synchronization message

→ Selects "Sync Across Devices"

→ Sign Up

→ Account created

→ Local favorites merged into Supabase

→ Favorites now associated with authenticated user

Never erase the user's local favorites during account creation.

---

# 10. Returning Authenticated User

Launch application

→ Existing Supabase session restored

→ Home loads

→ Favorites retrieved from Supabase

→ Favorites available immediately

---

# 11. Sign-In From New Device

Install application

→ Skip onboarding or complete onboarding

→ Sign In

→ Supabase session created

→ Cloud favorites downloaded

→ Favorites screen populated

---

# 12. Screen Inventory

The MVP should contain approximately the following screens.

## Onboarding

1. Splash
2. Welcome
3. Discover Movies
4. Save Favorites
5. Sync Across Devices
6. Authentication Choice

## Authentication

7. Sign In
8. Sign Up

## Application

9. Home
10. Search
11. Search Results
12. Movie Details
13. Favorites
14. Profile

## Supporting States

15. Empty Favorites
16. Search Empty State
17. Search No Results
18. Loading
19. Network Error
20. Authentication Error

---

# 13. Visual Design Direction

The application should feel:

- Cinematic
- Premium
- Modern
- Immersive
- Minimal
- Elegant
- Fast
- Content-first

Avoid making the interface look like:

- A generic ecommerce application
- A dashboard
- A corporate website
- A traditional database application

Movie artwork should dominate the experience.

---

# 14. Color System (Stitch "Cinematic Editorial")

Use the Stitch dark editorial cinema aesthetic.

## Cinema Canvas (Background)

`#111214`

Used for:
- Main application background
- Full-screen dark stages
- Root screen canvas (never pure black)

## Raised Stage (Cards & Surfaces)

`#1B1D20`

Used for:
- Movie cards
- Bottom navigation bar
- Session cards and preview containers
- Technical specification cards

## Quiet Stage (Inputs & Auxiliaries)

`#25282C`

Used for:
- Search text inputs
- Genre filter chips
- Skeleton bases
- Auxiliary button containers

## Frame Border

`#35383C`

Used for:
- Subtle 1px dividers and container borders

## Cinema Amber (Primary Accent)

`#D7A35B`

The sole accent color used for:
- Active favorite heart icons
- 52px Primary call-to-action buttons
- Active bottom tab icon & label
- Star rating score highlights
- Live soundstage indicator pulse dots

## Primary Ink

`#F5F3EF`

Used for:
- Movie titles and primary headings
- Screen titles

## Secondary Ink

`#B2B2B0`

Used for:
- Subtitles, release years, runtimes, body copy

## Muted Ink

`#83868A`

Used for:
- Captions, timestamps, disabled indicators

## Success

`#36C98F`

## Error

`#FFB4AB`

---

# 15. Typography

Use a clean modern sans-serif family.

Recommended:

Inter

Alternative:

SF Pro Display / SF Pro Text on iOS

Roboto on Android where appropriate.

## Display

36–40px

Weight:

700

Use only for major cinematic headings.

## Screen Title

28–32px

Weight:

700

## Section Heading

20–22px

Weight:

600–700

## Card Title

16–18px

Weight:

600

## Body

15–16px

Weight:

400

## Supporting Text

13–14px

Weight:

400

## Metadata

12–13px

Weight:

500

Maintain strong contrast and readable spacing.

---

# 16. Spacing System

Use an 8px-based spacing scale.

4px\
8px\
12px\
16px\
24px\
32px\
40px\
48px

Primary horizontal screen padding:

16–20px

Large sections:

24–32px vertical spacing.

Avoid cramped cards.

---

# 17. Shape Language

Use rounded interfaces without making everything excessively soft.

## Standard radius

12px

## Movie cards

12–16px

## Buttons

12–14px

## Search fields

14px

## Pills / genres

999px

## Bottom sheets

24px top radius

---

# 18. Button System

## Primary Button

Background:

Primary accent red

Text:

White

Height:

50–54px

Border radius:

12px

Weight:

600

Examples:

- Get Started
- Sign In
- Create Account
- Sync Favorites

---

## Secondary Button

Background:

`#191C23`

Text:

White

Examples:

- Continue as Guest
- Cancel

---

## Text Button

Transparent

Examples:

- Skip
- Forgot Password
- Already have an account?

---

# 19. Movie Card Component

Create a reusable movie card.

### Poster

Portrait aspect ratio:

2:3

### Radius

12px

### Content

- Poster
- Movie title
- Release year
- Optional rating
- Favorite icon

Poster should remain dominant.

Do not overload cards with metadata.

---

# 20. Horizontal Movie Rail

Used on Home.

Structure:

Section title

Optional "See All"

Horizontal scroll list

Movie poster cards

Recommended sections:

- Trending Now
- Popular
- Top Rated
- New Releases

---

# 21. Splash Screen

Purpose:

Brand introduction and application initialization.

Design:

Dark background.

Centered application logo or movie-inspired brand mark.

Very subtle glow or gradient.

Avoid complicated content.

Actions:

None.

System behavior:

Restore persisted onboarding state.

Restore Supabase session.

Load local favorites.

---

# 22. Welcome Onboarding Screen

Hero artwork should dominate the upper portion.

Use cinematic movie poster collage or dramatic entertainment imagery.

Content:

Headline:

"Your next favorite movie starts here."

Supporting text:

"Discover movies, save the ones you love, and keep your favorites wherever you go."

Primary CTA:

Get Started

Secondary action:

Skip

---

# 23. Discover Movies Onboarding

Visual:

Movie posters or discovery interface preview.

Headline:

"Discover something worth watching."

Description:

"Explore trending, popular, and highly rated movies in seconds."

CTA:

Next

Progress indicator:

Step 1 of 3 or dots.

---

# 24. Favorites Onboarding

Visual:

Poster grid with heart animation.

Headline:

"Save what catches your eye."

Description:

"Build your favorites list while you browse. No account required."

CTA:

Next

---

# 25. Cloud Sync Onboarding

Visual:

Phone → cloud → second phone metaphor.

Headline:

"Take your favorites anywhere."

Description:

"Create an account when you're ready and your favorites will follow you across devices."

CTA:

Continue

Secondary:

Continue as Guest

Authentication should be clearly optional.

---

# 26. Authentication Choice Screen

Headline:

"How would you like to continue?"

Buttons:

Create Account

Sign In

Continue as Guest

Supporting text:

"You can browse and save favorites without an account."

Make guest access visible rather than hiding it.

---

# 27. Sign-In Screen

Content:

Back navigation

Title:

"Welcome back"

Subtitle:

"Sign in to access your favorites across devices."

Fields:

Email

Password

Password visibility toggle

Primary CTA:

Sign In

Secondary:

Create Account

Optional:

Forgot Password

Error states:

Invalid email

Incorrect password

Connection failure

Unknown authentication error

---

# 28. Sign-Up Screen

Title:

"Create your account"

Subtitle:

"Sync your favorite movies across all your devices."

Fields:

Email

Password

Confirm Password

Primary CTA:

Create Account

Secondary:

Already have an account? Sign In

Guest migration message when relevant:

"Your current favorites will be added to your account."

---

# 29. Home Screen

The Home screen should feel immersive.

## Header

Left:

Small application logo / brand

Right:

Profile avatar or search shortcut

---

## Hero Section

Large featured movie backdrop.

Use gradient overlay for readability.

Content:

Movie title

Release year

Genres

Rating

Short overview

Buttons:

View Details

Favorite icon

Hero should use approximately 45–55% of first viewport height.

---

# 30. Home Rails

Below hero:

Trending Now

Popular Movies

Top Rated

New Releases

Use horizontally scrolling movie rails.

The Home screen must be scrollable vertically.

---

# 31. Search Screen

Header:

Search Movies

Large search input near top.

Placeholder:

"Search movies..."

Search icon.

Clear button when input contains content.

Recent searches may be stored locally.

Optional categories before typing:

Action\
Comedy\
Drama\
Horror\
Sci-Fi\
Romance

---

# 32. Search Results

Use two-column poster grid on standard phones.

Each result:

Poster

Movie title

Release year

Favorite icon

Search query stays visible at top.

Infinite scrolling may be supported.

---

# 33. Search Empty State

Before query:

Icon or illustration.

Text:

"Find your next movie."

Subtext:

"Search by movie title."

---

# 34. Search No Results

Headline:

"No movies found"

Subtext:

"Try another title or check the spelling."

CTA:

Clear Search

---

# 35. Movie Details Screen

One of the most important screens.

## Top

Full-width backdrop or poster.

Overlay:

Back button

Favorite button

Use readable gradient.

---

## Main Content

Movie title

Release year

Runtime

Rating

Genres

Overview

Primary interaction:

Add to Favorites / Remove from Favorites

---

## Secondary Content

Optional:

Cast preview

Trailer button

Recommendations

Only add these if the movie API supports them reliably.

---

# 36. Favorite Interaction

Heart should react immediately.

Never make users wait for server completion before visual feedback.

Use optimistic UI.

States:

Not Favorite

Favorite

Saving

Sync error

If guest:

Update Zustand/local storage immediately.

If authenticated:

Update UI immediately and synchronize Supabase.

If synchronization fails:

Maintain clear retry behavior.

---

# 37. Favorites Screen

Header:

Favorites

For authenticated user:

Small cloud-synced indicator may be displayed.

For guest:

Optional subtle banner:

"Sign in to sync favorites across devices."

Do not make the banner disruptive.

---

## Favorite Grid

Two-column movie poster grid.

Each item:

Poster

Movie title

Release year

Favorite/remove button

Tap card:

Movie Details.

---

# 38. Empty Favorites State

Icon:

Outlined heart

Headline:

"No favorites yet"

Description:

"Movies you save will appear here."

CTA:

Discover Movies

For guests add secondary prompt:

"Sign in anytime to sync your favorites."

---

# 39. Profile Screen — Guest

Header:

Profile

Guest avatar.

Title:

"You're browsing as a guest"

Description:

"Your favorites are saved on this device."

Primary CTA:

Create Account

Secondary CTA:

Sign In

Benefits section:

- Sync across devices
- Keep favorites backed up
- Restore favorites after reinstalling

---

# 40. Profile Screen — Authenticated

Avatar.

Email.

Status:

"Favorites synced"

Favorite count.

Options:

Account

Privacy

About

Sign Out

Sign-out button should not visually compete with main content.

---

# 41. Loading States

Use skeleton placeholders for movie rails and poster cards.

Avoid full-screen spinners where possible.

Examples:

Home:

Poster skeleton cards.

Search:

Grid skeleton.

Details:

Hero + text skeleton.

Favorites:

Poster skeleton.

---

# 42. Error States

Use friendly language.

Example:

"Something went wrong."

"We couldn't load movies right now."

Actions:

Try Again

Return Home

Network error should not destroy cached favorites.

---

# 43. Offline Behavior

Local favorites should remain accessible offline.

Guests:

Fully dependent on local persistence.

Authenticated:

Previously loaded favorites should remain locally cached.

When connection returns:

Synchronize pending favorite changes.

---

# 44. Motion System

Animations should feel polished but restrained.

Recommended duration:

150–300ms.

Use:

- Fade
- Scale
- Slide
- Shared poster transitions where practical
- Heart favorite animation

Avoid:

- Long page transitions
- Excessive bouncing
- Heavy decorative motion

---

# 45. Haptic Feedback

On supported devices:

Light haptic:

Favorite added

Favorite removed

Primary confirmation interaction

Do not trigger haptics for ordinary scrolling.

---

# 46. Accessibility

Minimum touch target:

44×44px.

Support:

- Dynamic text sizing where feasible
- Screen-reader labels
- High contrast
- Semantic button labels
- Focus order
- Accessible form errors

Do not convey states using color alone.

---

# 47. Data Architecture

Use three primary data domains.

## Movie Data

External movie API.

Examples:

TMDB API or equivalent.

Movie information is not permanently duplicated into Supabase unless necessary.

---

## Local Data

Stored using persistent local storage.

Contains:

- onboardingCompleted
- guestFavorites
- recentSearches
- lightweight cached movie references
- pending synchronization actions

---

## Supabase Data

Contains:

- users through Supabase Auth
- authenticated user favorites

---

# 48. Supabase Favorites Schema

Suggested table:

`favorites`

Fields:

`id`

UUID primary key

`user_id`

UUID references authenticated user

`movie_id`

External movie identifier

`created_at`

Timestamp

Unique constraint:

`user_id + movie_id`

---

# 49. Row Level Security

Favorites should use Supabase RLS.

Policy:

Users may SELECT only rows where:

`auth.uid() = user_id`

Users may INSERT only rows where:

`auth.uid() = user_id`

Users may DELETE only rows where:

`auth.uid() = user_id`

Users must never access another user's favorites.

---

# 50. Zustand State Architecture

Recommended stores:

## Auth Store

Contains:

- session
- user
- initializing
- signIn
- signUp
- signOut

---

## Favorites Store

Contains:

- favorites
- loading
- hydrated
- addFavorite
- removeFavorite
- isFavorite
- synchronizeFavorites
- migrateGuestFavorites

---

## Movie Store

Optional.

Contains cached discovery content if needed.

---

## App Store

Contains:

- onboardingCompleted
- theme preferences
- network state
- initialization status

---

# 51. Favorites Synchronization Rules

## Guest

On favorite:

Save movie ID locally.

On remove:

Delete movie ID locally.

---

## Authenticated

Use Supabase as cloud source.

Also maintain a local cache.

---

# 52. Guest Migration

When guest creates account or signs in:

1. Load guest favorite IDs.
2. Load cloud favorite IDs.
3. Merge the two sets.
4. Remove duplicates.
5. Insert missing local favorites into Supabase.
6. Refresh cloud favorites.
7. Only clear guest migration queue after server confirmation.

Never delete cloud favorites merely because they are absent locally.

---

# 53. App Startup Sequence

1. Show splash.
2. Hydrate Zustand persistent state.
3. Read onboarding state.
4. Restore Supabase session.
5. Load local favorites.
6. If signed in, synchronize cloud favorites.
7. Render appropriate route.

Avoid blocking the entire application unnecessarily.

---

# 54. Component Library

Build reusable components.

Recommended components:

`AppButton`

`IconButton`

`MovieCard`

`MovieRail`

`MovieGrid`

`FavoriteButton`

`SearchInput`

`SectionHeader`

`PosterImage`

`RatingBadge`

`GenreChip`

`EmptyState`

`ErrorState`

`LoadingMovieCard`

`GuestSyncBanner`

`ScreenContainer`

---

# 55. Image Treatment

Movie posters are the main visual element.

Rules:

- Preserve poster aspect ratio
- Use high-quality imagery
- Lazy load remote images
- Display image placeholder
- Fade image in when loaded
- Never stretch posters
- Use gradient overlays on hero backdrops

---

# 56. Design Consistency

Every screen must share:

- Same spacing system
- Same typography hierarchy
- Same radius system
- Same button sizing
- Same navigation patterns
- Same movie card design
- Same color tokens

Avoid individually styled screens.

---

# 57. Responsive Requirements

Design primarily for mobile portrait.

Minimum reference width:

320px.

Primary reference:

390px.

Support:

- Small phones
- Large phones
- iPhone safe areas
- Android gesture/navigation areas

Tablet optimization can come after MVP.

---

# 58. Expo Implementation Guidelines

Use:

Expo Router

React Native

TypeScript

Zustand

Supabase JS

AsyncStorage or compatible persistent Zustand storage

Expo Image when useful

Expo Haptics

Expo SecureStore for appropriate sensitive session data if required

---

# 59. Suggested Folder Architecture

```text
app/
  _layout.tsx

  (onboarding)/
    index.tsx
    discover.tsx
    favorites.tsx
    sync.tsx
    auth-choice.tsx

  (auth)/
    sign-in.tsx
    sign-up.tsx

  (tabs)/
    _layout.tsx
    index.tsx
    search.tsx
    favorites.tsx
    profile.tsx

  movie/
    [id].tsx

components/
  ui/
  movies/
  auth/

stores/
  auth-store.ts
  favorites-store.ts
  app-store.ts

services/
  supabase.ts
  movie-api.ts
  favorites-service.ts

hooks/

types/

utils/

constants/
```

---

# 60. Acceptance Criteria

The MVP is complete when:

## Onboarding

- New user sees onboarding.
- User can skip onboarding.
- Onboarding does not appear again after completion unless reset.

## Guest Usage

- Guest can browse movies.
- Guest can search.
- Guest can open movie details.
- Guest can favorite movies.
- Guest favorites survive app restart.

## Authentication

- User can register.
- User can sign in.
- User session survives restart.
- User can sign out.

## Cloud Favorites

- Authenticated user's favorite saves to Supabase.
- Favorite appears after app restart.
- User can sign into another device and retrieve favorites.

## Migration

- Guest favorites merge with authenticated favorites.
- Existing cloud favorites are not lost.
- Duplicate records are not created.

## UX

- Loading states exist.
- Error states exist.
- Empty states exist.
- Navigation works correctly.
- Favorite feedback is immediate.

---

# 61. Stitch Screen Generation Instructions

When generating screens in Google Stitch:

Maintain the same dark cinematic design system across every generated screen.

Generate mobile layouts only.

Use real-looking movie poster imagery where possible.

Prioritize content hierarchy over decorative elements.

Do not introduce:

- bright white application backgrounds
- excessive gradients
- large glassmorphism panels
- ecommerce styling
- corporate dashboard patterns

The interface should resemble a premium modern entertainment application.

---

# 62. Recommended Stitch Generation Order

Generate screens in this order:

1. Home
2. Movie Details
3. Search
4. Search Results
5. Favorites
6. Profile Guest
7. Profile Authenticated
8. Welcome Onboarding
9. Discover Onboarding
10. Favorites Onboarding
11. Cloud Sync Onboarding
12. Authentication Choice
13. Sign In
14. Sign Up
15. Empty States
16. Error States

The Home screen should establish the primary design language.

All later screens should reuse its design system.

---

# 63. First Stitch Prompt

Use this when generating the first Home screen:

> Design a premium cinematic mobile movie discovery application Home screen for React Native. Use a sophisticated dark interface with #08090D as the primary background and restrained cinema-red #E50914 accents.
>
> The screen should include a dramatic full-width featured movie hero with backdrop image, gradient overlay, movie title, year, genres, rating, short description, View Details button, and heart favorite button.
>
> Below the hero create horizontally scrolling movie poster sections for Trending Now, Popular Movies, Top Rated, and New Releases.
>
> Add a minimal top header with a small movie app logo and profile avatar.
>
> Include a persistent bottom navigation with Home, Search, Favorites, and Profile.
>
> Use premium typography, generous spacing, 12–16px card radii, crisp poster images, subtle depth, minimal visual clutter, and strong information hierarchy.
>
> The interface should feel comparable to a premium modern streaming or movie discovery app without directly copying an existing product.
>
> Mobile portrait layout, approximately 390px wide.

---

# 64. Development Workflow

Follow this workflow throughout implementation:

Understand

→ Specify

→ Design

→ Plan data and architecture

→ Implement one bounded task

→ Run application

→ Test acceptance criteria

→ Compare against approved Stitch design

→ Correct differences

→ Update documentation

→ Commit changes

→ Continue with next bounded task

Do not implement the entire application in a single coding task.

Each implementation step should have clear acceptance criteria.

---

# 65. MVP Quality Bar

The final application should not feel like a prototype.

It should have:

- Consistent visual design
- Proper loading states
- Empty states
- Error states
- Responsive interactions
- Reliable navigation
- Persistent guest favorites
- Reliable authentication
- Secure cloud favorites
- Clear guest/account distinction
- Smooth guest-to-account migration
- Production-oriented component structure

The primary success criterion is that a person can install the application, skip account creation, immediately discover movies and save favorites, and later create an account without losing anything they already saved.


## Web/mobile Google sign-in and in-app playback update (2026-10-12)

- Google sign-in uses Supabase PKCE with one callback exchange shared by the browser result and Expo Router callback route. Web redirects preserve the configured deployment base path; installed mobile apps use `austinmoviebox://auth-callback`.
- Session restoration starts automatically. Favorites sync runs in the background after local hydration and does not hold the user on the sign-in screen.
- Official trailers play inside the app using the YouTube IFrame API. The native WebView identifies the app through its base URL, while the website uses its real origin. Missing, restricted, or failed trailers have explicit states and retry controls. Playback does not require Google sign-in.
- Full-length movie streams are not supplied by the current TMDB catalog. A separate video source must be specified before adding full-movie playback.
- See `docs/auth-and-playback.md` for exact callback URLs, verification, and outstanding release steps. Earlier blanket QA PASS claims do not establish that these new changes have been tested on physical devices.
