/**
 * DEPRECATED: Movie catalog is now loaded dynamically and exclusively from TMDB API.
 * No dummy or hardcoded mock movies are stored here.
 * See: src/services/movie-api.ts
 */

import { Movie } from '../types';

export const MOVIES: Movie[] = [];

export const GENRES: string[] = [
  'All',
  'Action',
  'Sci-Fi',
  'Drama',
  'Adventure',
  'Thriller',
  'Animation',
  'Crime',
];

export function getFeaturedMovie(): Movie | null {
  return null;
}

export function getSpotlightMovie(): Movie | null {
  return null;
}

export function getTrendingMovies(): Movie[] {
  return [];
}

export function getPopularMovies(): Movie[] {
  return [];
}

export function getTopRatedMovies(): Movie[] {
  return [];
}

export function getNewReleasesMovies(): Movie[] {
  return [];
}

export function getMovieById(_id: string): Movie | undefined {
  return undefined;
}

export function searchMovies(_query: string, _genre: string = 'All'): Movie[] {
  return [];
}
