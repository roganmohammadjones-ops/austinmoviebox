# MovieBox — Implementation Hub

Welcome to the internal **Implementation Directory** for the MovieBox mobile application.  
This directory serves as the centralized, self-contained reference for the complete architecture, phased roadmap, task breakdown, database schemas, and testing verification for the project.

---

## 📁 Directory Structure & Documentation Map

Every specification, architecture diagram, and task tracker is accessible directly inside this folder:

| Document | Description |
| :--- | :--- |
| **[README.md](file:///Users/apple/Downloads/AustinMovieBox/implementation/README.md)** | This document — index, quick start, and directory guide |
| **[PLAN.md](file:///Users/apple/Downloads/AustinMovieBox/implementation/PLAN.md)** | Bounded-task implementation plan, phased roadmap, and milestone milestones |
| **[ARCHITECTURE.md](file:///Users/apple/Downloads/AustinMovieBox/implementation/ARCHITECTURE.md)** | Technical architecture, routing hierarchy, Zustand state flow, and data sync mechanics |
| **[TASKS.md](file:///Users/apple/Downloads/AustinMovieBox/implementation/TASKS.md)** | Granular task checklist with verification status and acceptance criteria |
| **[DATABASE.md](file:///Users/apple/Downloads/AustinMovieBox/implementation/DATABASE.md)** | Supabase PostgreSQL schema, RLS policies, indexing, and migration instructions |
| **[TESTING.md](file:///Users/apple/Downloads/AustinMovieBox/implementation/TESTING.md)** | QA test scripts, verification matrix, and edge case checklist |
| **[BLUEPRINT.md](file:///Users/apple/Downloads/AustinMovieBox/implementation/BLUEPRINT.md)** | Core product blueprint & user flows specification |
| **[DESIGN.md](file:///Users/apple/Downloads/AustinMovieBox/implementation/DESIGN.md)** | Comprehensive 65-section visual and UI design system guide |
| **[AGENT.md](file:///Users/apple/Downloads/AustinMovieBox/implementation/AGENT.md)** | Agent Operating Guide and repository directives |

---

## 🚀 Quick Start & Verification

### Run the App
```bash
# Start Metro bundler
npm run start

# Launch on iOS Simulator
npm run ios

# Launch on Android Emulator
npm run android

# Launch in Web Browser
npm run web
```

### Validate Code Quality
```bash
# Typecheck TypeScript code
npx tsc --noEmit

# Run ESLint validation
npm run lint
```

---

## 🎯 Core Product Principles

1. **Frictionless Discovery**: Zero barrier to entry. Users can explore movies, search catalog titles, and view details immediately without being forced to create an account.
2. **Local-First Persistence**: Guest users store favorites locally via `@react-native-async-storage/async-storage` wrapped in Zustand. Local favorites persist across app restarts.
3. **Seamless Cloud Transition & Non-Destructive Migration**: When a guest user logs in or registers via Supabase, their existing local favorites are automatically merged ($Local \cup Cloud$) into their Supabase cloud library without duplicates and without ever losing data.
4. **Dark Cinematic Aesthetic**: Strict adherence to the dark cinema color palette (`#08090D` root canvas, `#141923` elevated cards, `#E50914` Cinema Red accent, `#F5C518` Rating Gold).
