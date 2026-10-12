import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import {
  syncFavoritesWithCloud,
  uploadFavoriteToCloud,
  removeFavoriteFromCloud,
} from '../services/cloud-sync';
import { fetchMovieDetails } from '../services/movie-api';
import { Movie } from '../types';

const FAVORITES_STORAGE_KEY = '@moviebox_favorites';

// Legacy dummy IDs to purge if previously saved in local storage
const DUMMY_SLUG_IDS = new Set([
  'dune-2',
  'oppenheimer',
  'spider-verse-2',
  'the-dark-knight',
  'interstellar',
  'inception',
  'blade-runner-2049',
  'the-batman',
  'parasite',
  'eeaao',
  'whiplash',
  'gladiator',
]);

interface FavoritesState {
  favorites: Movie[];
  isHydrated: boolean;
  isLoading: boolean;
  hydrateFavorites: () => Promise<void>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (movie: Movie, userId?: string) => Promise<void>;
  addFavorite: (movie: Movie, userId?: string) => Promise<void>;
  removeFavorite: (id: string, userId?: string) => Promise<void>;
  syncWithCloud: (userId: string) => Promise<void>;
  clearFavorites: () => Promise<void>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isHydrated: false,
  isLoading: false,

  hydrateFavorites: async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        let parsed: any;
        try {
          parsed = JSON.parse(stored);
        } catch {
          parsed = null;
        }

        // Handle possible object wrappers, e.g. { favorites: [...] } or Zustand persist
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          if (Array.isArray(parsed.favorites)) {
            parsed = parsed.favorites;
          } else if (parsed.state && Array.isArray(parsed.state.favorites)) {
            parsed = parsed.state.favorites;
          }
        }

        if (Array.isArray(parsed)) {
          const resolved: Movie[] = [];
          for (const item of parsed) {
            if (
              item &&
              typeof item === 'object' &&
              typeof item.id === 'string' &&
              !DUMMY_SLUG_IDS.has(item.id)
            ) {
              resolved.push(item as Movie);
            } else if (typeof item === 'string' && !DUMMY_SLUG_IDS.has(item)) {
              try {
                const movie = await fetchMovieDetails(item);
                if (movie) resolved.push(movie);
              } catch {
                // skip unresolvable
              }
            }
          }

          set({ favorites: resolved, isHydrated: true });
          await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(resolved));
          return;
        }
      }

      // No dummy seeding — start with a clean vault
      set({ favorites: [], isHydrated: true });
    } catch (e) {
      console.warn('Failed to hydrate favorites:', e);
      set({ favorites: [], isHydrated: true });
    }
  },

  isFavorite: (id: string) => {
    if (!id) return false;
    const current = get().favorites;
    if (!Array.isArray(current)) return false;
    return current.some((m) => {
      if (!m) return false;
      if (typeof m === 'string') return m === id;
      return m.id === id;
    });
  },

  addFavorite: async (movie: Movie, userId?: string) => {
    if (!movie?.id) return;
    const current = Array.isArray(get().favorites) ? get().favorites : [];
    if (current.some((m) => (typeof m === 'string' ? m === movie.id : m?.id === movie.id))) return;

    const updated = [movie, ...current];
    set({ favorites: updated });
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));

    if (userId) {
      uploadFavoriteToCloud(userId, movie);
    }
  },

  removeFavorite: async (id: string, userId?: string) => {
    if (!id) return;
    const current = Array.isArray(get().favorites) ? get().favorites : [];
    const updated = current.filter((m) => (typeof m === 'string' ? m !== id : m?.id !== id));
    set({ favorites: updated });
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));

    if (userId) {
      removeFavoriteFromCloud(userId, id);
    }
  },

  toggleFavorite: async (movie: Movie, userId?: string) => {
    if (!movie?.id) return;
    if (get().isFavorite(movie.id)) {
      await get().removeFavorite(movie.id, userId);
    } else {
      await get().addFavorite(movie, userId);
    }
  },

  syncWithCloud: async (userId: string) => {
    if (!userId) return;
    set({ isLoading: true });
    try {
      const current = Array.isArray(get().favorites) ? get().favorites : [];
      const synced = await syncFavoritesWithCloud(userId, current);
      const safeSynced = Array.isArray(synced) ? synced : current;
      set({ favorites: safeSynced, isLoading: false });
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(safeSynced));
    } catch (err) {
      console.warn('syncWithCloud error:', err);
      set({ isLoading: false });
    }
  },

  clearFavorites: async () => {
    set({ favorites: [] });
    await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
  },
}));
