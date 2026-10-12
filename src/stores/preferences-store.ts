import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemeMode = 'dark-cinema' | 'oled' | 'midnight-slate';
export type CatalogRegion = 'US' | 'GB' | 'CA' | 'AU' | 'GLOBAL';

export interface PreferencesState {
  themeMode: ThemeMode;
  region: CatalogRegion;
  autoplayTrailers: boolean;
  highQualityPosters: boolean;
  hapticsEnabled: boolean;
  isLoaded: boolean;

  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setRegion: (region: CatalogRegion) => Promise<void>;
  setAutoplayTrailers: (enabled: boolean) => Promise<void>;
  setHighQualityPosters: (enabled: boolean) => Promise<void>;
  setHapticsEnabled: (enabled: boolean) => Promise<void>;
  resetPreferences: () => Promise<void>;
  loadPreferences: () => Promise<void>;
}

const PREFERENCES_STORAGE_KEY = '@moviebox_preferences';

const DEFAULT_PREFERENCES = {
  themeMode: 'dark-cinema' as ThemeMode,
  region: 'US' as CatalogRegion,
  autoplayTrailers: true,
  highQualityPosters: true,
  hapticsEnabled: true,
};

export const THEME_CONFIGS: Record<ThemeMode, { name: string; description: string; previewAccent: string; previewBg: string }> = {
  'dark-cinema': {
    name: 'Dark Cinema (Default)',
    description: 'Deep Obsidian canvas with warm cinema amber accents.',
    previewAccent: '#F5C518',
    previewBg: '#08090D',
  },
  'oled': {
    name: 'OLED Pitch Black',
    description: 'Pure #000000 black canvas for AMOLED battery savings and cinema crimson.',
    previewAccent: '#E50914',
    previewBg: '#000000',
  },
  'midnight-slate': {
    name: 'Midnight Slate',
    description: 'Cool studio slate navy canvas with crisp cyan highlights.',
    previewAccent: '#38BDF8',
    previewBg: '#0B0F19',
  },
};

export const REGION_CONFIGS: Record<CatalogRegion, { label: string; code: string; flag: string }> = {
  US: { label: 'United States', code: 'US', flag: '🇺🇸' },
  GB: { label: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  CA: { label: 'Canada', code: 'CA', flag: '🇨🇦' },
  AU: { label: 'Australia', code: 'AU', flag: '🇦🇺' },
  GLOBAL: { label: 'Global / International', code: 'GLOBAL', flag: '🌐' },
};

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...DEFAULT_PREFERENCES,
  isLoaded: false,

  loadPreferences: async () => {
    try {
      if (AsyncStorage?.getItem) {
        const stored = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          set({
            themeMode: parsed.themeMode || DEFAULT_PREFERENCES.themeMode,
            region: parsed.region || DEFAULT_PREFERENCES.region,
            autoplayTrailers: parsed.autoplayTrailers ?? DEFAULT_PREFERENCES.autoplayTrailers,
            highQualityPosters: parsed.highQualityPosters ?? DEFAULT_PREFERENCES.highQualityPosters,
            hapticsEnabled: parsed.hapticsEnabled ?? DEFAULT_PREFERENCES.hapticsEnabled,
            isLoaded: true,
          });
          return;
        }
      }
      set({ isLoaded: true });
    } catch {
      set({ ...DEFAULT_PREFERENCES, isLoaded: true });
    }
  },

  setThemeMode: async (mode: ThemeMode) => {
    set({ themeMode: mode });
    try {
      if (AsyncStorage?.setItem) {
        const current = {
          themeMode: mode,
          region: get().region,
          autoplayTrailers: get().autoplayTrailers,
          highQualityPosters: get().highQualityPosters,
          hapticsEnabled: get().hapticsEnabled,
        };
        await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(current));
      }
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  },

  setRegion: async (region: CatalogRegion) => {
    set({ region });
    try {
      if (AsyncStorage?.setItem) {
        const current = {
          themeMode: get().themeMode,
          region,
          autoplayTrailers: get().autoplayTrailers,
          highQualityPosters: get().highQualityPosters,
          hapticsEnabled: get().hapticsEnabled,
        };
        await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(current));
      }
    } catch (e) {
      console.warn('Failed to save region preference', e);
    }
  },

  setAutoplayTrailers: async (enabled: boolean) => {
    set({ autoplayTrailers: enabled });
    try {
      if (AsyncStorage?.setItem) {
        const current = {
          themeMode: get().themeMode,
          region: get().region,
          autoplayTrailers: enabled,
          highQualityPosters: get().highQualityPosters,
          hapticsEnabled: get().hapticsEnabled,
        };
        await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(current));
      }
    } catch (e) {
      console.warn('Failed to save autoplay preference', e);
    }
  },

  setHighQualityPosters: async (enabled: boolean) => {
    set({ highQualityPosters: enabled });
    try {
      if (AsyncStorage?.setItem) {
        const current = {
          themeMode: get().themeMode,
          region: get().region,
          autoplayTrailers: get().autoplayTrailers,
          highQualityPosters: enabled,
          hapticsEnabled: get().hapticsEnabled,
        };
        await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(current));
      }
    } catch (e) {
      console.warn('Failed to save quality preference', e);
    }
  },

  setHapticsEnabled: async (enabled: boolean) => {
    set({ hapticsEnabled: enabled });
    try {
      if (AsyncStorage?.setItem) {
        const current = {
          themeMode: get().themeMode,
          region: get().region,
          autoplayTrailers: get().autoplayTrailers,
          highQualityPosters: get().highQualityPosters,
          hapticsEnabled: enabled,
        };
        await AsyncStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(current));
      }
    } catch (e) {
      console.warn('Failed to save haptics preference', e);
    }
  },

  resetPreferences: async () => {
    set({ ...DEFAULT_PREFERENCES, isLoaded: true });
    try {
      if (AsyncStorage?.removeItem) {
        await AsyncStorage.removeItem(PREFERENCES_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to reset preferences', e);
    }
  },
}));
