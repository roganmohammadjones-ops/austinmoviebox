# AustinMovieBox

<p align="center">
  <img src="./assets/images/logo-emblem.png" alt="AustinMovieBox Logo" width="120" height="120" />
</p>

<p align="center">
  <strong>Curated Theatrical Archive & Cinematic Discovery Vault</strong>
</p>

<p align="center">
  <a href="https://roganmohammadjones-ops.github.io/austinmoviebox"><strong>🌐 Launch Live Web App</strong></a> •
  <a href="https://expo.dev/artifacts/eas/iCt8562Sk7jMm1hnpLbUAeesCkdcKJUTDtuOPMfvbAM.apk"><strong>📱 Download Android APK (v1.0.1)</strong></a> •
  <a href="https://expo.dev/accounts/austinmoviebox/projects/austinemoviebox/builds/87d2e287-34a7-4730-8812-9056c6e0cb3b"><strong>⚡ EAS Build Log</strong></a>
</p>

---

## 🎬 Overview

**AustinMovieBox** is a high-performance cross-platform cinematic application built with **React Native**, **Expo SDK 57**, **Expo Router**, **TypeScript**, and **NativeWind**. It delivers a theatrical discovery experience, enabling film lovers to explore curated cinema, stream official movie trailers, and curate their personal watchlist with offline persistence and optional cloud synchronization.

---

## ✨ Features

- **Theatrical Catalog Discovery**: Real-time browsing across Trending, Popular, Top Rated, and Fresh Theatrical Releases powered by The Movie Database (TMDB) API.
- **Local-First Watchlist Vault**: Add and manage favorite titles instantly with zero friction. Bookmarks persist locally across restarts without requiring user sign-in.
- **Seamless Cloud Sync**: Sign in with Email or Google to automatically synchronize your favorites across all your devices using non-destructive union merging.
- **Theatrical Video Player**: Watch official high-definition movie trailers in-app with playback controls, cast info, and native sharing.
- **Dark Cinematic Design System**: Built with an editorial palette (`#08090D` canvas, `#141923` cards, `#F5C518` amber rating accents, and clean transparent branding).
- **Curator Preferences**: Custom regional filtering (US, UK, CA, FR, DE, JP), saved theme preferences, and live TMDB connectivity diagnostics.
- **Universal Cross-Platform**: Runs natively on Android, iOS, and Web with responsive layouts from mobile phones to desktop displays.

---

## 📱 Mobile APK Download (Android)

The production Android release has been built and verified with zero crash errors:

- **Latest Version**: `v1.0.1` (Build code `3`)
- **Direct APK Download**: [AustinMovieBox-v1.0.1.apk](https://expo.dev/artifacts/eas/iCt8562Sk7jMm1hnpLbUAeesCkdcKJUTDtuOPMfvbAM.apk)
- **EAS Build Artifact**: [View on Expo EAS](https://expo.dev/accounts/austinmoviebox/projects/austinemoviebox/builds/87d2e287-34a7-4730-8812-9056c6e0cb3b)

> **Note for Android Installation**: If updating from an earlier test build, uninstall the previous build first before installing the new APK.

---

## 🌐 Web App Deployment

AustinMovieBox is deployed as a static web application:

- **Live URL**: [https://roganmohammadjones-ops.github.io/austinmoviebox](https://roganmohammadjones-ops.github.io/austinmoviebox)
- Automated deployment via GitHub Actions on every push to `main` ([`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)).

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Expo SDK 57](https://expo.dev), [React Native 0.86](https://reactnative.dev) |
| **Routing** | [Expo Router v4](https://docs.expo.dev/router/introduction/) (File-based routes) |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) (Strict typing, 0 errors) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) via [NativeWind v4](https://www.nativewind.dev/) |
| **State Management** | [Zustand v5](https://github.com/pmndrs/zustand) with AsyncStorage middleware |
| **Backend & Cloud Sync** | [Supabase](https://supabase.com) (Auth, PostgreSQL, Row Level Security) |
| **Movie Metadata** | [The Movie Database (TMDB) API](https://developer.themoviedb.org/docs) |
| **Media & Icons** | `expo-image`, `@expo/vector-icons` (Ionicons) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v20 or v22 recommended)
- [npm](https://npmjs.com) or [bun](https://bun.sh)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) (`npx expo`)

### Installation

```bash
# Clone the repository
git clone https://github.com/roganmohammadjones-ops/austinmoviebox.git
cd austinmoviebox

# Install dependencies
npm install

# Start local Metro development server
npm run start
```

### Run on Platforms

```bash
# Android emulator or device
npm run android

# iOS simulator
npm run ios

# Web browser
npm run web
```

### Running Tests

```bash
# Run automated unit tests
npm test

# Type checking
npx tsc --noEmit

# Project health audit
npx expo-doctor
```

---

## 📄 License & Attribution

- **AustinMovieBox** © 2026. All rights reserved.
- Film metadata and artwork provided by **[The Movie Database (TMDB)](https://www.themoviedb.org)**. This product uses the TMDB API but is not endorsed or certified by TMDB.


## Google Sign-In & In-App Playback

See [configuration and verification](docs/auth-and-playback.md) for Expo web, GitHub Pages, and mobile callback URLs. Official trailers stay inside the app. Full-movie streaming requires a separate video source. Local fixes require a new web deployment and mobile build before existing installations receive them.
