/**
 * MovieBox — TMDB & Movie Data API Service
 * 
 * Provides seamless integration with The Movie Database (TMDB) API
 * with graceful fallback to curated local data when unconfigured or offline.
 */

import { Movie } from '../types';
import {
  MOVIES,
  getNewReleasesMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMovies,
} from '../data/movies';

// TMDB Configuration from environment variables
const rawApiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY?.trim() || '';
const rawAccessToken = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN?.trim() || '';
const baseUrl =
  process.env.EXPO_PUBLIC_TMDB_BASE_URL?.trim() || 'https://api.themoviedb.org/3';
const imageBaseUrl =
  process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL?.trim() || 'https://image.tmdb.org/t/p';

/**
 * Checks whether TMDB is configured with valid credentials (not placeholder tokens)
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
 * Builds request headers for TMDB API (supports either v4 Access Token Bearer or v3 API Key query)
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
 * Builds the URL with API key appended if Bearer token is not in use
 */
function buildUrl(endpoint: string, params: Record<string, string> = {}): string {
  const url = new URL(`${baseUrl}${endpoint}`);
  
  if (!rawAccessToken && rawApiKey) {
    url.searchParams.set('api_key', rawApiKey);
  }

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
}

/**
 * Helper to map TMDB genre IDs to human-readable names
 */
const TMDB_GENRES: Record<number, string> = {
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
 * Maps TMDB movie object to internal Movie entity
 */
export function mapTmdbMovie(tmdbMovie: any): Movie {
  const releaseDate = tmdbMovie.release_date || '';
  const releaseYear = releaseDate ? parseInt(releaseDate.substring(0, 4), 10) || 2024 : 2024;
  
  const posterUrl = tmdbMovie.poster_path
    ? `${imageBaseUrl}/w780${tmdbMovie.poster_path}`
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=780&q=80';

  const backdropUrl = tmdbMovie.backdrop_path
    ? `${imageBaseUrl}/w1280${tmdbMovie.backdrop_path}`
    : posterUrl;

  const genres: string[] = Array.isArray(tmdbMovie.genres)
    ? tmdbMovie.genres.map((g: any) => g.name)
    : Array.isArray(tmdbMovie.genre_ids)
    ? tmdbMovie.genre_ids.map((id: number) => TMDB_GENRES[id] || 'Cinema')
    : ['Cinema'];

  const cast = tmdbMovie.credits?.cast?.slice(0, 5).map((actor: any) => ({
    name: actor.name,
    character: actor.character,
    avatarUrl: actor.profile_path ? `${imageBaseUrl}/w185${actor.profile_path}` : undefined,
  }));

  const director = tmdbMovie.credits?.crew?.find((crew: any) => crew.job === 'Director')?.name;

  return {
    id: String(tmdbMovie.id),
    title: tmdbMovie.title || 'Untitled',
    overview: tmdbMovie.overview || 'No overview available.',
    posterUrl,
    backdropUrl,
    rating: Number((tmdbMovie.vote_average || 7.0).toFixed(1)),
    releaseYear,
    genres: genres.length > 0 ? genres : ['Cinema'],
    durationMinutes: tmdbMovie.runtime || 120,
    director,
    cast,
    tagline: tmdbMovie.tagline || undefined,
    releaseDate,
  };
}

/**
 * Fetches trending movies (fallback to local curated trending)
 */
export async function fetchTrendingMovies(): Promise<Movie[]> {
  if (!isTmdbConfigured) {
    return getTrendingMovies();
  }

  try {
    const res = await fetch(buildUrl('/trending/movie/week'), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).slice(0, 10).map(mapTmdbMovie);
  } catch (error) {
    console.warn('[TMDB] Failed to fetch trending movies, using local fallback:', error);
    return getTrendingMovies();
  }
}

/**
 * Fetches popular movies (fallback to local curated popular)
 */
export async function fetchPopularMovies(): Promise<Movie[]> {
  if (!isTmdbConfigured) {
    return getPopularMovies();
  }

  try {
    const res = await fetch(buildUrl('/movie/popular'), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).slice(0, 10).map(mapTmdbMovie);
  } catch (error) {
    console.warn('[TMDB] Failed to fetch popular movies, using local fallback:', error);
    return getPopularMovies();
  }
}

/**
 * Fetches top rated movies (fallback to local curated top rated)
 */
export async function fetchTopRatedMovies(): Promise<Movie[]> {
  if (!isTmdbConfigured) {
    return getTopRatedMovies();
  }

  try {
    const res = await fetch(buildUrl('/movie/top_rated'), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).slice(0, 10).map(mapTmdbMovie);
  } catch (error) {
    console.warn('[TMDB] Failed to fetch top rated movies, using local fallback:', error);
    return getTopRatedMovies();
  }
}

/**
 * Fetches new release / now playing movies (fallback to local curated new releases)
 */
export async function fetchNewReleasesMovies(): Promise<Movie[]> {
  if (!isTmdbConfigured) {
    return getNewReleasesMovies();
  }

  try {
    const res = await fetch(buildUrl('/movie/now_playing'), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).slice(0, 10).map(mapTmdbMovie);
  } catch (error) {
    console.warn('[TMDB] Failed to fetch new releases, using local fallback:', error);
    return getNewReleasesMovies();
  }
}

/**
 * Search movies by query
 */
export async function searchMovies(query: string): Promise<Movie[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  if (!isTmdbConfigured) {
    return MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(trimmed) ||
        m.overview.toLowerCase().includes(trimmed) ||
        m.genres.some((g) => g.toLowerCase().includes(trimmed))
    );
  }

  try {
    const res = await fetch(buildUrl('/search/movie', { query }), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return (data.results || []).map(mapTmdbMovie);
  } catch (error) {
    console.warn('[TMDB] Search error, using local fallback:', error);
    return MOVIES.filter(
      (m) =>
        m.title.toLowerCase().includes(trimmed) ||
        m.overview.toLowerCase().includes(trimmed)
    );
  }
}

/**
 * Fetches movie details by ID
 */
export async function fetchMovieDetails(id: string): Promise<Movie | null> {
  const localMatch = MOVIES.find((m) => m.id === id);

  if (!isTmdbConfigured || isNaN(Number(id))) {
    return localMatch || null;
  }

  try {
    const res = await fetch(buildUrl(`/movie/${id}`, { append_to_response: 'credits' }), {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`TMDB HTTP error ${res.status}`);
    const data = await res.json();
    return mapTmdbMovie(data);
  } catch (error) {
    console.warn('[TMDB] Movie details error, using local match:', error);
    return localMatch || null;
  }
}
