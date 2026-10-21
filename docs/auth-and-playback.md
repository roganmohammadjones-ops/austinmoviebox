# Google sign-in and in-app playback

## Implemented behavior

Google sign-in uses the configured Supabase Google provider with email/profile scopes and PKCE. `src/services/oauth-flow.ts` parses both PKCE callbacks and older token-fragment callbacks and deduplicates native callback delivery. `src/stores/auth-store.ts` owns session updates. The browser returns to its current origin plus the configured base path, and installed apps return through `austinmoviebox://auth-callback`. An unsuccessful callback returns to the sign-in screen with an error rather than silently navigating home.

The root layout starts favorites sync after a session is available and local favorites have hydrated. Sign-in does not wait for cloud favorites. This does not resolve the existing offline deletion and account-isolation limitations of the favorites store.

Official trailers play in a modal inside the app, independent of authentication. Web and native use the same YouTube IFrame API document. Native WebViews supply the installed app identifier as an HTTPS base URL for player identification; web embeds use the current website origin. The player reports actual readiness, playback, unavailable-video and embedding-restriction states. When a trailer is unavailable or embedding is disabled, it tries up to three distinct trailers/teasers listed by TMDB, prioritizing official trailers. It honors the stored autoplay setting. Closing the modal unmounts the video, and Retry creates a new player. A missing trailer never opens a YouTube search embed or launches an external browser automatically.

TMDB supplies movie metadata and trailer identifiers. The current application has no full-length movie source.

## Supabase and Google setup

Google is enabled on Supabase project `bvbhiqwaeycnhoqfkrpj`. Google authorization initiation has been checked, but the dashboard redirect allowlist needs confirmation by the project owner.

In Supabase **Authentication → URL Configuration**, retain the existing production site URL and allow the exact callbacks for the environments in use:

- `austinmoviebox://auth-callback` — installed Android/iOS application.
- `https://austin-moviebox.expo.app/auth-callback` — Expo domain found in the current Google consent configuration; confirm it is the intended deployment.
- `https://roganmohammadjones-ops.github.io/austinmoviebox/auth-callback` — GitHub Pages.
- `http://localhost:8081/auth-callback` — default Expo web development server.
- `http://localhost:8087/auth-callback` — temporary local verification server used during this change.

Add exact preview callback URLs when testing other deployments. Avoid a global wildcard. Test mobile authentication with an installed development/release build that registers the app scheme.

In Google's OAuth web client configuration, the authorized redirect URI is:

`https://bvbhiqwaeycnhoqfkrpj.supabase.co/auth/v1/callback`

The mobile custom scheme belongs in Supabase's allowlist, not in Google's web callback field. The Google client secret stays in Supabase; it must not be put in Expo public environment variables.

## Web export

For local Expo web or EAS Hosting, leave `EXPO_PUBLIC_WEB_BASE_PATH` empty. For GitHub Pages, set it to `/austinmoviebox` **at export time**. `app.config.js` passes the setting to Expo's base-path configuration. The Pages workflow supplies this value.

## Verification and remaining release work

- Unit tests cover actual callback parsing/exchange deduplication, deployment paths, player document configuration, and error messages.
- TypeScript and lint checks pass after the implementation changes.
- Android, iOS and root-hosted web bundles exported successfully. A separate GitHub Pages export produced assets under `/austinmoviebox`.
- The local web preview loaded the real TMDB catalog. The Google button opened Google's account picker; the user completed sign-in and returned to an authenticated profile. The session persisted in a fresh browser tab and after a full page reload.
- A trailer with embedding disabled produced the intended in-app restriction message.
- The production Expo/GitHub Pages callback allowlist and sign-in/playback on physical Android/iOS devices still need verification.
- These changes have not yet been published to the Expo website, GitHub Pages, or a replacement APK.

## References

- [Supabase native mobile deep linking](https://supabase.com/docs/guides/auth/native-mobile-deep-linking)
- [Supabase redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [YouTube embedded player identification](https://developers.google.com/youtube/terms/required-minimum-functionality#embedded-youtube-player)
- [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference)
