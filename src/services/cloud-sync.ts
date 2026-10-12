/**
 * MovieBox — Cloud Synchronization & Migration Service
 * Adheres strictly to AGENT.md §2.7 and DESIGN.md §51-§52.
 *
 * Rules:
 * 1. Never erase cloud favorites merely because they are missing locally.
 * 2. Never erase local favorites before confirmation from Supabase.
 * 3. Union set (Local ∪ Cloud) deduplicated by movie_id.
 * 4. Resilient timeout and error handling.
 */

import { Movie, SyncResult } from '../types/index';
import { isSupabaseConfigured, supabase, withTimeout } from './supabase';

/**
 * Fetches all saved favorites for the given authenticated user from Supabase.
 */
export async function fetchCloudFavorites(userId: string): Promise<Movie[]> {
  if (!isSupabaseConfigured || !userId) {
    return [];
  }

  try {
    const fetchOperation = async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('movie_id, movie_data')
        .eq('user_id', userId);

      if (error) {
        console.warn('[CloudSync] Error fetching cloud favorites:', error.message);
        return [];
      }

      return (data || [])
        .map((row: any) => row.movie_data as Movie)
        .filter((movie): movie is Movie => Boolean(movie && movie.id));
    };

    return await withTimeout(fetchOperation(), 8000, []);
  } catch (err: any) {
    console.warn('[CloudSync] fetchCloudFavorites failed:', err?.message || err);
    return [];
  }
}

/**
 * Upserts a single movie into the user's Supabase cloud favorites.
 */
export async function uploadFavoriteToCloud(
  userId: string,
  movie: Movie
): Promise<boolean> {
  if (!isSupabaseConfigured || !userId || !movie?.id) {
    return false;
  }

  try {
    const uploadOperation = async () => {
      const { error } = await supabase.from('favorites').upsert(
        {
          user_id: userId,
          movie_id: movie.id,
          movie_data: movie,
        },
        { onConflict: 'user_id,movie_id' }
      );

      if (error) {
        console.warn('[CloudSync] Error uploading favorite to cloud:', error.message);
        return false;
      }
      return true;
    };

    return await withTimeout(uploadOperation(), 8000, false);
  } catch (err: any) {
    console.warn('[CloudSync] uploadFavoriteToCloud failed:', err?.message || err);
    return false;
  }
}

/**
 * Removes a movie by ID from the user's Supabase cloud favorites.
 */
export async function removeFavoriteFromCloud(
  userId: string,
  movieId: string
): Promise<boolean> {
  if (!isSupabaseConfigured || !userId || !movieId) {
    return false;
  }

  try {
    const removeOperation = async () => {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movieId);

      if (error) {
        console.warn('[CloudSync] Error removing favorite from cloud:', error.message);
        return false;
      }
      return true;
    };

    return await withTimeout(removeOperation(), 8000, false);
  } catch (err: any) {
    console.warn('[CloudSync] removeFavoriteFromCloud failed:', err?.message || err);
    return false;
  }
}

/**
 * Uploads a list of movies in batches to avoid payload size or concurrency limits.
 */
export async function batchUploadFavorites(
  userId: string,
  movies: Movie[],
  chunkSize = 25
): Promise<{ uploaded: number; failed: number }> {
  if (!isSupabaseConfigured || !userId || movies.length === 0) {
    return { uploaded: 0, failed: 0 };
  }

  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < movies.length; i += chunkSize) {
    const chunk = movies.slice(i, i + chunkSize);
    const rows = chunk.map((m) => ({
      user_id: userId,
      movie_id: m.id,
      movie_data: m,
    }));

    try {
      const chunkOperation = async () => {
        const { error } = await supabase
          .from('favorites')
          .upsert(rows, { onConflict: 'user_id,movie_id' });

        if (error) {
          console.warn('[CloudSync] Batch upload error:', error.message);
          return false;
        }
        return true;
      };

      const success = await withTimeout(chunkOperation(), 8000, false);
      if (success) {
        uploaded += chunk.length;
      } else {
        failed += chunk.length;
      }
    } catch (err) {
      console.warn('[CloudSync] Batch upload chunk exception:', err);
      failed += chunk.length;
    }
  }

  return { uploaded, failed };
}

/**
 * Performs a strict non-destructive two-way sync:
 * 1. Fetches remote cloud favorites.
 * 2. Merges (Local ∪ Cloud) deduplicated by movie ID.
 * 3. Uploads local-only items to Supabase.
 * 4. Preserves all items; never deletes items merely because they were absent locally.
 */
export async function syncFavoritesDetailed(
  userId: string,
  localFavorites: Movie[]
): Promise<SyncResult> {
  const safeLocalFavorites = Array.isArray(localFavorites) ? localFavorites : [];

  if (!isSupabaseConfigured || !userId) {
    return {
      success: true,
      mergedMovies: safeLocalFavorites,
      uploadedCount: 0,
    };
  }

  try {
    const cloudFavorites = await fetchCloudFavorites(userId);

    // Compute union set (Local ∪ Cloud) deduplicated by ID
    const movieMap = new Map<string, Movie>();
    cloudFavorites.forEach((movie) => {
      if (movie && movie.id) {
        movieMap.set(movie.id, movie);
      }
    });
    safeLocalFavorites.forEach((movie) => {
      if (movie && movie.id) {
        movieMap.set(movie.id, movie);
      }
    });

    const mergedMovies = Array.from(movieMap.values());

    // Identify local items not yet in the cloud
    const cloudIds = new Set(cloudFavorites.map((m) => m.id));
    const toUpload = safeLocalFavorites.filter((m) => m && m.id && !cloudIds.has(m.id));

    let uploadedCount = 0;
    if (toUpload.length > 0) {
      const batchResult = await batchUploadFavorites(userId, toUpload);
      uploadedCount = batchResult.uploaded;
    }

    return {
      success: true,
      mergedMovies,
      uploadedCount,
    };
  } catch (err: any) {
    console.warn('[CloudSync] syncFavoritesDetailed exception:', err);
    return {
      success: false,
      mergedMovies: safeLocalFavorites,
      uploadedCount: 0,
      error: err?.message || 'Sync failed',
    };
  }
}

/**
 * Backward-compatible sync function returning merged Movie[] array.
 */
export async function syncFavoritesWithCloud(
  userId: string,
  localFavorites: Movie[]
): Promise<Movie[]> {
  const result = await syncFavoritesDetailed(userId, localFavorites);
  return result.mergedMovies;
}
