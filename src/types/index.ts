export interface CastMember {
  name: string;
  character: string;
  avatarUrl?: string;
}

export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number; // e.g. 8.4
  releaseYear: number;
  genres: string[];
  durationMinutes: number;
  director?: string;
  cast?: CastMember[];
  tagline?: string;
  formatBadge?: string;
  releaseDate?: string;
  ageRating?: string;
  cinematography?: string;
  sound?: string;
  studio?: string;
  trailerUrl?: string;
  youtubeKey?: string;
  youtubeKeys?: string[];
}

export type MovieCategory = 'trending' | 'popular' | 'top_rated' | 'new_releases';

export type MovieGenre =
  | 'All'
  | 'Action'
  | 'Sci-Fi'
  | 'Drama'
  | 'Adventure'
  | 'Thriller'
  | 'Animation'
  | 'Crime'
  | 'Fantasy'
  | 'Horror'
  | 'Comedy';

export interface UserProfile {
  id: string;
  email: string;
  createdAt?: string;
}

export interface CloudFavoriteRecord {
  id: string;
  user_id: string;
  movie_id: string;
  movie_data: Movie;
  created_at: string;
}

export interface SyncResult {
  success: boolean;
  mergedMovies: Movie[];
  uploadedCount: number;
  error?: string;
}

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error';

export * from './database';
