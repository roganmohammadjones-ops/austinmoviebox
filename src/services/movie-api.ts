/**
 * MovieBox — TMDB & Movie Data API Service
 * 
 * Direct, live integration with The Movie Database (TMDB) API.
 * Pure TMDB API data with zero dummy or hardcoded mock fallbacks.
 */

import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';
import { Movie } from '../types';

// TMDB Configuration from environment variables
const defaultTmdbApiKey = 'd713b8b71e557bd1d18b9b230d0c4a7a';
const defaultTmdbAccessToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNzEzYjhiNzFlNTU3YmQxZDE4YjliMjMwZDBjNGE3YSIsIm5iZiI6MTc5MTc3NzI1Ni4wOTQsInN1YiI6IjZhY2M1OWU4MTBhM2RiMDIwY2RlYWYwMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.CIEwkGKOqydyDcxCL4MXPV4crX2-KP5jIy-7JMFJEqk';

const rawApiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY?.trim() || defaultTmdbApiKey;
const rawAccessToken = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN?.trim() || defaultTmdbAccessToken;
const baseUrl =
  process.env.EXPO_PUBLIC_TMDB_BASE_URL?.trim() || 'https://api.themoviedb.org/3';
const imageBaseUrl =
  process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL?.trim() || 'https://image.tmdb.org/t/p';

/**
 * Checks whether TMDB is configured with valid credentials
 */
export const isTmdbConfigured: boolean = Boolean(
  (rawApiKey &&
    !rawApiKey.includes('your_tmdb_api_key') &&
    rawApiKey.length > 10) ||
  (rawAccessToken &&
    !rawAccessToken.includes('your_tmdb_read_access_token') &&
    rawAccessToken.length > 20)
);

export const TMDB_CONFIG = {
  apiKey: rawApiKey,
  accessToken: rawAccessToken,
  baseUrl,
  imageBaseUrl,
  isConfigured: isTmdbConfigured,
};

/**
 * Builds request headers for TMDB API
 */
function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (rawAccessToken && !rawAccessToken.includes('your_tmdb_read_access_token')) {
    headers.Authorization = `Bearer ${rawAccessToken}`;
  }

  return headers;
}

/**
 * Builds the URL with API key and query parameters
 */
function buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${baseUrl}${cleanEndpoint}`);

  if (rawApiKey && !rawApiKey.includes('your_tmdb_api_key')) {
    url.searchParams.set('api_key', rawApiKey);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

/**
 * TMDB Genre ID to Name Mapping
 */
export const TMDB_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

/**
 * Canonical list of TMDB genres for filters
 */
export const TMDB_GENRES_LIST: { id: number; name: string }[] = [
  { id: 0, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

/**
 * Maps raw TMDB movie payload to internal Movie entity using strictly available data.
 * No dummy ratings, durations, or fictional crew entries.
 */
export function mapTmdbMovie(tmdbMovie: any): Movie {
  if (!tmdbMovie || !tmdbMovie.id) {
    throw new Error('Invalid TMDB movie response');
  }

  const releaseDate: string = tmdbMovie.release_date || '';
  const releaseYear: number = releaseDate
    ? parseInt(releaseDate.substring(0, 4), 10) || 0
    : 0;

  const posterUrl = tmdbMovie.poster_path
    ? `${imageBaseUrl}/w780${tmdbMovie.poster_path}`
    : tmdbMovie.backdrop_path
    ? `${imageBaseUrl}/w780${tmdbMovie.backdrop_path}`
    : '';

  const backdropUrl = tmdbMovie.backdrop_path
    ? `${imageBaseUrl}/w1280${tmdbMovie.backdrop_path}`
    : posterUrl;

  const genres: string[] =
    Array.isArray(tmdbMovie.genres) && tmdbMovie.genres.length > 0
      ? tmdbMovie.genres.map((g: any) => g.name || '').filter(Boolean)
      : Array.isArray(tmdbMovie.genre_ids) && tmdbMovie.genre_ids.length > 0
      ? tmdbMovie.genre_ids.map((id: number) => TMDB_GENRES[id] || '').filter(Boolean)
      : [];

  const cast = tmdbMovie.credits?.cast
    ? tmdbMovie.credits.cast.slice(0, 10).map((actor: any) => ({
        name: actor.name || 'Unknown',
        character: actor.character || '',
        avatarUrl: actor.profile_path ? `${imageBaseUrl}/w185${actor.profile_path}` : undefined,
      }))
    : undefined;

  const director = tmdbMovie.credits?.crew?.find(
    (crew: any) => crew.job === 'Director'
  )?.name;

  const cinematography = tmdbMovie.credits?.crew?.find(
    (crew: any) => crew.job === 'Director of Photography' || crew.job === 'Cinematographer'
  )?.name;

  const sound = tmdbMovie.credits?.crew?.find(
    (crew: any) => crew.job === 'Original Music Composer' || crew.job === 'Music'
  )?.name;

  const studio = tmdbMovie.production_companies?.[0]?.name;

  // Real age rating from release_dates (US certification preferred, fallback to any available)
  let ageRating: string | undefined;
  if (tmdbMovie.release_dates?.results && Array.isArray(tmdbMovie.release_dates.results)) {
    const usRelease = tmdbMovie.release_dates.results.find((r: any) => r.iso_3166_1 === 'US');
    const usCert = usRelease?.release_dates?.find((rd: any) => rd.certification?.trim())?.certification?.trim();
    if (usCert) {
      ageRating = usCert;
    } else {
      const anyCert = tmdbMovie.release_dates.results
        .flatMap((r: any) => r.release_dates || [])
        .find((rd: any) => rd.certification?.trim())?.certification?.trim();
      if (anyCert) {
        ageRating = anyCert;
      }
    }
  }

  const rating =
    typeof tmdbMovie.vote_average === 'number'
      ? Number(tmdbMovie.vote_average.toFixed(1))
      : 0;

  const durationMinutes =
    typeof tmdbMovie.runtime === 'number' ? tmdbMovie.runtime : 0;

  let youtubeKey: string | undefined;
  let trailerUrl: string | undefined;

  if (tmdbMovie.videos?.results && Array.isArray(tmdbMovie.videos.results)) {
    const youtubeVideos = tmdbMovie.videos.results.filter(
      (v: any) => v.site === 'YouTube' && v.key
    );
    const officialTrailer =
      youtubeVideos.find((v: any) => v.type === 'Trailer' && v.official) ||
      youtubeVideos.find((v: any) => v.type === 'Trailer') ||
      youtubeVideos.find((v: any) => v.type === 'Teaser') ||
      youtubeVideos[0];

    if (officialTrailer?.key) {
      youtubeKey = officialTrailer.key;
      trailerUrl = `https://www.youtube.com/watch?v=${officialTrailer.key}`;
    }
  }

  // Fallback trailer search URL if direct YouTube video key is not attached
  if (!trailerUrl) {
    const movieTitle = tmdbMovie.title || tmdbMovie.original_title || '';
    if (movieTitle) {
      trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `${movieTitle} ${releaseYear ? releaseYear + ' ' : ''}official trailer`
      )}`;
    }
  }

  return {
    id: String(tmdbMovie.id),
    title: tmdbMovie.title || tmdbMovie.original_title || 'Untitled',
    overview: tmdbMovie.overview || '',
    posterUrl,
    backdropUrl,
    rating,
    releaseYear,
    genres,
    durationMinutes,
    director,
    cast,
    tagline: tmdbMovie.tagline?.trim() || undefined,
    releaseDate,
    ageRating,
    cinematography,
    sound,
    studio,
    trailerUrl,
    youtubeKey,
  };
}

/**
 * Fetches trending movies from TMDB
 */
export async function fetchTrendingMovies(): Promise<Movie[]> {
  if (!isTmdbConfigured) {
    console.warn('[TMDB] API credentials are not configured');
    return [];
  }

  try {
    const res = await fetch(buildUrl('/trending/movie/week'), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).map(mapTmdbMovie);
  } catch (error) {
    console.error('[TMDB] Failed to fetch trending movies:', error);
    return [];
  }
}

/**
 * Fetches popular movies from TMDB
 */
export async function fetchPopularMovies(): Promise<Movie[]> {
  if (!isTmdbConfigured) {
    console.warn('[TMDB] API credentials are not configured');
    return [];
  }

  try {
    const res = await fetch(buildUrl('/movie/popular'), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).map(mapTmdbMovie);
  } catch (error) {
    console.error('[TMDB] Failed to fetch popular movies:', error);
    return [];
  }
}

/**
 * Fetches top rated movies from TMDB
 */
export async function fetchTopRatedMovies(): Promise<Movie[]> {
  if (!isTmdbConfigured) {
    console.warn('[TMDB] API credentials are not configured');
    return [];
  }

  try {
    const res = await fetch(buildUrl('/movie/top_rated'), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).map(mapTmdbMovie);
  } catch (error) {
    console.error('[TMDB] Failed to fetch top rated movies:', error);
    return [];
  }
}

/**
 * Fetches new release / now playing movies from TMDB
 */
export async function fetchNewReleasesMovies(): Promise<Movie[]> {
  if (!isTmdbConfigured) {
    console.warn('[TMDB] API credentials are not configured');
    return [];
  }

  try {
    const res = await fetch(buildUrl('/movie/now_playing'), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).map(mapTmdbMovie);
  } catch (error) {
    console.error('[TMDB] Failed to fetch new releases:', error);
    return [];
  }
}

/**
 * Searches movies on TMDB by text query, optionally filtered by genre
 */
export async function searchMovies(query: string, genreId?: number): Promise<Movie[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  if (!isTmdbConfigured) {
    console.warn('[TMDB] API credentials are not configured');
    return [];
  }

  try {
    const res = await fetch(buildUrl('/search/movie', { query: trimmed }), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    let movies = (data.results || []).map(mapTmdbMovie);

    if (genreId && genreId > 0) {
      const genreName = TMDB_GENRES[genreId]?.toLowerCase();
      if (genreName) {
        movies = movies.filter((m: Movie) =>
          m.genres.some((g: string) => g.toLowerCase() === genreName)
        );
      }
    }

    return movies;
  } catch (error) {
    console.error('[TMDB] Search error:', error);
    return [];
  }
}

/**
 * Fetches movies by genre from TMDB /discover/movie endpoint
 */
export async function fetchMoviesByGenre(genreId: number): Promise<Movie[]> {
  if (!isTmdbConfigured) {
    console.warn('[TMDB] API credentials are not configured');
    return [];
  }

  try {
    const params: Record<string, string | number> = {
      sort_by: 'popularity.desc',
    };
    if (genreId > 0) {
      params.with_genres = genreId;
    }

    const res = await fetch(buildUrl('/discover/movie', params), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).map(mapTmdbMovie);
  } catch (error) {
    console.error('[TMDB] Failed to discover movies by genre:', error);
    return [];
  }
}

/**
 * Fetches full movie details by ID directly from TMDB
 * Appends credits and release_dates for real cast, crew, and certification data.
 */
export async function fetchMovieDetails(id: string): Promise<Movie | null> {
  if (!id || !isTmdbConfigured) {
    return null;
  }

  try {
    const res = await fetch(
      buildUrl(`/movie/${id}`, { append_to_response: 'credits,release_dates,videos' }),
      {
        headers: getHeaders(),
      }
    );
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`TMDB HTTP error ${res.status}`);
    }
    const data = await res.json();
    return mapTmdbMovie(data);
  } catch (error) {
    console.error('[TMDB] Movie details error:', error);
    return null;
  }
}

/**
 * Theatrical Video Player Helper: Opens official movie trailer in full-screen in-app viewer.
 * Supports direct YouTube trailer key with fallback to official trailer search.
 */
export async function openMovieTrailer(movie: Movie): Promise<void> {
  if (!movie) return;

  let key = movie.youtubeKey;
  if (!key && movie.id) {
    key = (await fetchMovieTrailerKey(movie.id)) || undefined;
  }

  const directVideoUrl = key ? `https://www.youtube.com/watch?v=${key}` : null;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title} ${movie.releaseYear || ''} official trailer`
  )}`;
  const targetUrl = directVideoUrl || movie.trailerUrl || searchUrl;

  // On Web, use window.open or Linking to avoid popup blocker issues
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined') {
        const win = window.open(targetUrl, '_blank', 'noopener,noreferrer');
        if (win) return;
      }
    } catch (e) {
      console.warn('[Trailer] Web window.open failed:', e);
    }
    try {
      await Linking.openURL(targetUrl);
      return;
    } catch (linkErr) {
      console.warn('[Trailer] Web Linking.openURL failed:', linkErr);
    }
  }

  // On native platforms, prefer opening the YouTube app if key is present
  if (key && (Platform.OS === 'ios' || Platform.OS === 'android')) {
    const youtubeAppUrl = `vnd.youtube:${key}`;
    try {
      const canOpen = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpen) {
        await Linking.openURL(youtubeAppUrl);
        return;
      }
    } catch {
      // YouTube app not installed or schema not permitted, fall through
    }
  }

  // Fallback to in-app browser or standard linking
  try {
    await WebBrowser.openBrowserAsync(targetUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      toolbarColor: '#111214',
      controlsColor: '#D7A35B',
    });
  } catch (err) {
    console.warn('[Trailer] Failed to open in WebBrowser, trying Linking:', err);
    try {
      await Linking.openURL(targetUrl);
    } catch (linkErr) {
      console.error('[Trailer] Could not open URL via Linking:', linkErr);
    }
  }
}

/**
 * Fetches the official YouTube trailer video key for a given movie directly from TMDB
 */
export async function fetchMovieTrailerKey(movieId: string): Promise<string | null> {
  if (!movieId || !isTmdbConfigured) return null;

  try {
    const res = await fetch(buildUrl(`/movie/${movieId}/videos`), {
      headers: getHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return null;

    const youtubeVideos = data.results.filter(
      (v: any) => v.site === 'YouTube' && v.key
    );

    const officialTrailer =
      youtubeVideos.find((v: any) => v.type === 'Trailer' && v.official) ||
      youtubeVideos.find((v: any) => v.type === 'Trailer') ||
      youtubeVideos.find((v: any) => v.type === 'Teaser') ||
      youtubeVideos[0];

    return officialTrailer?.key || null;
  } catch (err) {
    console.error('[TMDB] Error fetching trailer key:', err);
    return null;
  }
}


