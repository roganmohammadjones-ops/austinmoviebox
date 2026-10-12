# Austin MovieBox — Design System & Visual Tokens (`design-system.md`)

> **Document**: Design Tokens, Thematic Palette, Typography, Components & Motion Standards  
> **Application**: Austin MovieBox (MovieBox MVP)  
> **Theme**: Cinematic Editorial (Dark Mode)  
> **Version**: 1.0.0  
> **Status**: Approved & Specified  

---

## 1. Design Direction & Aesthetic Philosophy

Austin MovieBox is designed around a **"Cinematic Editorial"** visual identity. The UI feels like an immersive, high-end cinema soundstage rather than a corporate dashboard or utilitarian database. 

### Core Tenets
1. **Theatrical Immersion**: A pure dark canvas (`#08090D`) creates high-contrast framing where movie poster artwork and backdrop banners become the vibrant focal points.
2. **Intentional Restraint**: Vibrant colors are reserved strictly for high-value actions: **Cinema Red** (`#E50914`) for primary calls-to-action and active favorite hearts, and **Star Gold** (`#F5C518`) for ratings.
3. **Strict Aspect Ratios**: Poster artwork strictly preserves the classical **2:3 aspect ratio** (`aspect-[2/3]`). Posters are never stretched, distorted, or cropped irregularly.
4. **Subtle Depth & Scrims**: Elevation is conveyed through multi-stop gradient scrims and deep charcoal tonal shifts (`#141923`, `#202736`), rather than bright artificial drop shadows.

---

## 2. Color System & Semantic Tokens

```
Canvas Base (#08090D) ──> Card Surface (#141923) ──> Input Surface (#202736) ──> Border (#35383C)
                                │
               Cinema Red (#E50914)  |  Rating Gold (#F5C518)
```

### 2.1 Thematic Palette Reference

| Token Name | Hex Code | Semantic Role & Usage |
| :--- | :--- | :--- |
| **Canvas Background** | `#08090D` | Root screen background canvas; never pure black `#000000`. |
| **Card Surface (Raised)** | `#141923` | Movie cards, elevated panels, modal backgrounds, tab bar. |
| **Input Surface (Quiet)** | `#202736` | Text inputs, inactive genre chips, skeleton bases, badge bases. |
| **Frame Border** | `#35383C` | Subtle 1px dividers, card boundaries, input outline borders. |
| **Cinema Red (Accent)** | `#E50914` | Primary CTAs, active bottom tab icon, active favorite heart. |
| **Rating Gold (Accent)**| `#F5C518` | Star rating icons, IMDb score badges, critic highlights. |
| **Primary Ink** | `#FFFFFF` | Headlines, movie titles, active chip text, primary buttons. |
| **Secondary Ink** | `#9CA3AF` | Release years, genres, synopsis body copy, subheaders. |
| **Muted Ink** | `#6B7280` | Inactive tab icons, input placeholders, disabled states. |
| **Success Emerald** | `#36C98F` | Cloud sync confirmation, verified badges, online indicators. |
| **Error Coral** | `#EF4444` / `#FFB4AB` | Validation errors, failed authentication alerts, warning badges. |

---

## 3. Typography Scale & Hierarchy

The application employs clean, legible modern sans-serif fonts (Outfit for prominent display titles, Inter / SF Pro for interface controls and body text).

| Style Level | Font Size | Line Height | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Title** | 36px–40px | 44px | Bold (700) | -0.5px | Splash screen title, major hero headings |
| **Screen Title** | 28px–32px | 36px | Bold (700) | -0.3px | Screen headers (Home, Search, Details) |
| **Section Heading**| 20px–22px | 28px | SemiBold (600) | 0px | Movie rail titles ("Trending Now", "Top Rated") |
| **Card Title** | 15px–16px | 20px | SemiBold (600) | 0px | Movie card titles (1-line truncation) |
| **Body Regular** | 15px–16px | 24px | Regular (400) | 0px | Movie synopsis, descriptions, onboarding body |
| **Control / Button**| 15px–16px | 20px | SemiBold (600) | +0.2px | Button text, action labels, modal CTAs |
| **Metadata / Badge**| 12px–13px | 16px | Medium (500) | +0.4px | Release year, duration, rating pill, genre chips |
| **Caption / Fine** | 11px–12px | 14px | Regular (400) | 0px | Form field hints, timestamp indicators |

---

## 4. Spacing System & Grid Layout

The layout strictly adheres to a **4px / 8px spatial rhythm**:

```
Spacing Scale:
4px  ──  8px  ──  12px  ──  16px  ──  20px  ──  24px  ──  32px  ──  40px  ──  48px
```

### Layout Rules
- **Horizontal Screen Padding**: `16px` on compact mobile; `20px` on standard phones; `32px` on tablets/desktop.
- **Inter-Item Rail Spacing**: `12px` to `16px` between horizontal movie cards.
- **Section Vertical Gap**: `24px` to `32px` between distinct movie rails on Home.
- **Grid Column Gap**: `16px` horizontal and `20px` vertical in 2-column grids (Search and Favorites).

### Responsive Viewport Breakpoints
- **Compact Mobile** ($\le 360\text{px}$): Single-column hero, card width `124px`, 2-column search grid with 12px gap.
- **Standard Mobile** ($375\text{px} - 430\text{px}$): Hero height `48vh`, card width `140px`, 2-column search grid with 16px gap.
- **Tablet / Large** ($\ge 768\text{px}$): Hero height `52vh`, card width `180px`, 3-to-4 column responsive grid, max content width constrained to `1024px`.

---

## 5. Shape Language & Corner Radii

Corner radii provide subtle modern elegance without feeling over-rounded:

| Element | Radius Token | Value |
| :--- | :--- | :--- |
| **Movie Poster Cards** | `rounded-2xl` | 14px–16px |
| **Action Buttons** | `rounded-xl` | 12px–14px |
| **Search Input Field** | `rounded-2xl` | 14px–16px |
| **Genre Filter Chips** | `rounded-full` | 9999px (Pill shape) |
| **Rating Badges** | `rounded-lg` | 8px |
| **Modal / Bottom Sheets**| `rounded-t-3xl` | 24px (Top corners) |

---

## 6. Aspect Ratios & Artwork Scrims

### 6.1 Classical Poster Aspect Ratio (2:3)
- Movie posters must strictly conform to `aspect-[2/3]`.
- Example dimensions:
  - Mini Card: $120\text{px} \times 180\text{px}$
  - Standard Card: $140\text{px} \times 210\text{px}$
  - Large / Detail Thumbnail: $160\text{px} \times 240\text{px}$

### 6.2 Theatrical Backdrop & Scrims (16:9)
- Backdrop images use landscape orientation (approximately 16:9).
- **Linear Gradient Scrim Overlay**:
  ```tsx
  <LinearGradient
    colors={['transparent', 'rgba(8,9,13,0.4)', '#08090D']}
    locations={[0, 0.6, 1]}
    style={StyleSheet.absoluteFillObject}
  />
  ```
- Guarantees high text legibility over diverse poster light levels.

---

## 7. Reusable Component Inventory

### 7.1 Buttons
- **Primary CTA**: Height 52px, background `#E50914`, text `#FFFFFF`, rounded-xl, font weight 600. Active press opacity 0.85.
- **Secondary Button**: Height 48px, background `#141923`, border 1px `#202736`, text `#FFFFFF`.
- **Ghost / Text Button**: Transparent background, text `#9CA3AF` or `#E50914`, padding 8px.

### 7.2 Chips & Badges
- **RatingBadge**: Gold star (`★`) icon + score string (`8.6`), background `rgba(245, 197, 24, 0.15)`, text `#F5C518`.
- **GenreChip**: Horizontal pill, padding `8px 16px`. Active: `#E50914` background. Inactive: `#141923` background with `#202736` border.

### 7.3 Favorite Heart Button
- Floating circular container with backdrop blur or dark surface.
- Unfavorited: Thin white outline heart (`#9CA3AF`).
- Favorited: Solid filled Cinema Red heart (`#E50914`) with a 1.2x spring scale pulse animation upon toggle.

### 7.4 GuestSyncBanner
- Elevated container `#141923` with 1px border `#202736`.
- Features cloud sync icon, informative prompt text, and a compact "Sync" action button.

---

## 8. Motion & Haptic Feedback

- **Transition Durations**: Fast and responsive, between 150ms and 250ms.
- **Easing Curve**: Standard cubic bezier `ease-out` / spring damping 15.
- **Haptics**:
  - Toggling Favorite: `Haptics.impactAsync(ImpactFeedbackStyle.Light)` provides immediate tactile confirmation.
  - Auth Error / Form Validation: `Haptics.notificationAsync(NotificationFeedbackType.Warning)`.

---

## 9. Accessibility (a11y) & HIG Standards

- **Touch Targets**: Minimum 44×44px interactive bounding box on all buttons, tabs, and icon targets.
- **Color Contrast**: All text styles meet or exceed WCAG AA ratio (4.5:1 for body text, 3:1 for large display text).
- **Screen Reader Support**: All icons and movie cards feature semantic `accessibilityLabel` attributes (e.g., `"Save Dune: Part Two to favorites"`).
