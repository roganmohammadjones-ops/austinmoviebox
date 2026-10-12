import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const ONBOARDING_STORAGE_KEY = '@moviebox_onboarding';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  isLoaded: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  loadOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasCompletedOnboarding: false,
  isLoaded: false,

  loadOnboarding: async () => {
    try {
      const stored = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      set({
        hasCompletedOnboarding: stored === 'true',
        isLoaded: true,
      });
    } catch {
      set({ hasCompletedOnboarding: false, isLoaded: true });
    }
  },

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      set({ hasCompletedOnboarding: true });
    } catch (e) {
      console.warn('Failed to save onboarding state', e);
      set({ hasCompletedOnboarding: true });
    }
  },

  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
      set({ hasCompletedOnboarding: false });
    } catch (e) {
      console.warn('Failed to reset onboarding state', e);
    }
  },
}));
